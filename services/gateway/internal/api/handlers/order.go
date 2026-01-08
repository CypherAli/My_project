package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nats-io/nats.go"
	"github.com/trading-platform/gateway/internal/models"
	"github.com/trading-platform/gateway/internal/util"
)

type OrderHandler struct {
	natsConn *nats.Conn
}

func NewOrderHandler(nc *nats.Conn) *OrderHandler {
	return &OrderHandler{natsConn: nc}
}

type createOrderRequest struct {
	Symbol   string  `json:"symbol" binding:"required"`
	Price    float64 `json:"price" binding:"required,gt=0"`
	Amount   float64 `json:"amount" binding:"required,gt=0"`
	Quantity float64 `json:"quantity"` // Alias for amount
	Side     string  `json:"side" binding:"required"`
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
	if side == "buy" {
		side = "Bid"
	} else if side == "sell" {
		side = "Ask"
	}

	// 1. Lấy UserID từ Token (tạm thời chưa dùng, sẽ dùng sau)
	_ = ctx.MustGet("authorization_payload").(*util.Payload)
	// Tạm thời giả định UserID = 1 (sau này query DB để lấy ID thật)
	userID := uint64(1)

	// 2. Tạo Order ID (Tạm thời dùng timestamp, sau này dùng Snowflake ID hoặc Sequence DB)
	orderID := uint64(time.Now().UnixNano())

	// 3. Tạo Command chuẩn format Rust (chuyển số về string)
	cmd := models.Command{
		Type: "Place",
		Data: models.OrderData{
			ID:        orderID,
			UserID:    userID,
			Symbol:    req.Symbol,
			Price:     fmt.Sprintf("%.8f", req.Price),
			Amount:    fmt.Sprintf("%.8f", amount),
			Side:      side,
			Timestamp: time.Now().Unix(),
		},
	}

	// 4. Serialize sang JSON
	data, err := json.Marshal(cmd)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to marshal command"})
		return
	}

	// 5. Bắn vào NATS topic "orders"
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
