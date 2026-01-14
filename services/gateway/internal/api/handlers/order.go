package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nats-io/nats.go"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/models"
	"github.com/trading-platform/gateway/internal/util"
)

type OrderHandler struct {
	natsConn *nats.Conn
	store    db.Store
}

func NewOrderHandler(nc *nats.Conn, store db.Store) *OrderHandler {
	return &OrderHandler{
		natsConn: nc,
		store:    store,
	}
}

type createOrderRequest struct {
	Symbol       string  `json:"symbol" binding:"required"`
	Price        float64 `json:"price"`
	Amount       float64 `json:"amount" binding:"required,gt=0"`
	Quantity     float64 `json:"quantity"` // Alias for amount
	Side         string  `json:"side" binding:"required"`
	Type         string  `json:"type" binding:"required,oneof=Limit Market StopLimit"` // Thêm StopLimit
	TriggerPrice float64 `json:"trigger_price"` // Bắt buộc cho StopLimit
}

func (h *OrderHandler) PlaceOrder(ctx *gin.Context) {
	var req createOrderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cho phép dùng quantity hoặc amount
	amount := req.Amount
	if amount == 0 && req.Quantity > 0 {
		amount = req.Quantity
	}

	// Chuẩn hóa side: buy/sell -> Bid/Ask
	side := req.Side
	switch side {
	case "buy":
		side = "Bid"
	case "sell":
		side = "Ask"
	}

	// Chuẩn hóa type: Mặc định là Limit nếu không có
	orderType := req.Type
	if orderType == "" {
		orderType = "Limit"
	}

	// Validate: Market Order không cần price, Limit Order bắt buộc có price
	if orderType == "Limit" && req.Price <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Limit order requires price > 0"})
		return
	}

	// Validate: StopLimit Order bắt buộc có cả trigger_price và limit price
	if orderType == "StopLimit" {
		if req.TriggerPrice <= 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "StopLimit order requires trigger_price > 0"})
			return
		}
		if req.Price <= 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "StopLimit order requires price > 0"})
			return
		}
		
		// Logic validation: Stop-Loss Sell (giảm giá) vs Stop-Buy (tăng giá)
		// Stop-Loss Sell: trigger_price < current_price, limit_price <= trigger_price
		// Stop-Buy: trigger_price > current_price, limit_price >= trigger_price
		// (Tạm thời skip validation này, engine sẽ xử lý)
	}

	// 1. Lấy UserID từ Token (tạm thời chưa dùng, sẽ dùng sau)
	_ = ctx.MustGet("authorization_payload").(*util.Payload)
	// Tạm thời giả định UserID = 1 (sau này query DB để lấy ID thật)
	userID := uint64(1)

	// 2. Tạo Order ID (Tạm thời dùng timestamp, sau này dùng Snowflake ID hoặc Sequence DB)
	orderID := uint64(time.Now().UnixNano())

	// 3. Chuẩn bị trigger_price (chỉ có với StopLimit)
	triggerPrice := ""
	if orderType == "StopLimit" {
		triggerPrice = fmt.Sprintf("%.8f", req.TriggerPrice)
	}

	// 4. Tạo Command chuẩn format Rust (chuyển số về string)
	cmd := models.Command{
		Type: "Place",
		Data: models.OrderData{
			ID:           orderID,
			UserID:       userID,
			Symbol:       req.Symbol,
			Price:        fmt.Sprintf("%.8f", req.Price),
			Amount:       fmt.Sprintf("%.8f", amount),
			Side:         side,
			Type:         orderType,
			TriggerPrice: triggerPrice, // Thêm trigger_price
			Timestamp:    time.Now().Unix(),
		},
	}

	// 5. Serialize sang JSON
	data, err := json.Marshal(cmd)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to marshal command"})
		return
	}

	// 6. Bắn vào NATS topic "orders"
	err = h.natsConn.Publish("orders", data)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to publish to NATS"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "Order placed successfully",
		"order_id": orderID,
	})
}

// cancelOrderRequest defines the request structure for canceling an order
type cancelOrderRequest struct {
	OrderID uint64 `json:"order_id" binding:"required"`
}

// ListOpenOrders lists all pending orders for the authenticated user
func (h *OrderHandler) ListOpenOrders(ctx *gin.Context) {
	// Lấy UserID từ Token
	payload := ctx.MustGet("authorization_payload").(*util.Payload)

	// Get user ID from username
	user, err := h.store.GetUserByUsername(ctx, payload.Username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user"})
		return
	}

	orders, err := h.store.ListPendingOrders(ctx, util.HashStringToInt64(user.ID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, orders)
}

// CancelOrder sends a cancel command to the matching engine via NATS
func (h *OrderHandler) CancelOrder(ctx *gin.Context) {
	var req cancelOrderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify that the order belongs to the user (optional security check)
	// For now, we trust the request and send to engine

	// Tạo Command Hủy gửi sang NATS
	cmd := models.Command{
		Type: "Cancel",
		Data: models.CancelData{
			OrderID: req.OrderID,
		},
	}

	// Serialize JSON
	data, err := json.Marshal(cmd)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to marshal cancel command"})
		return
	}

	// Bắn sang NATS topic "orders" (Rust đang nghe cái này)
	if err := h.natsConn.Publish("orders", data); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to publish cancel command"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Cancel request sent successfully"})
}
