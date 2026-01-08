package handlers

import (
	"encoding/json"
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
	Symbol string `json:"symbol" binding:"required"`
	Price  string `json:"price" binding:"required"`
	Amount string `json:"amount" binding:"required"`
	Side   string `json:"side" binding:"required,oneof=Bid Ask"`
}

func (h *OrderHandler) PlaceOrder(ctx *gin.Context) {
	var req createOrderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Lấy UserID từ Token (tạm thời chưa dùng, sẽ dùng sau)
	_ = ctx.MustGet("authorization_payload").(*util.Payload)
	// Tạm thời giả định UserID = 1 (sau này query DB để lấy ID thật)
	userID := uint64(1)

	// 2. Tạo Order ID (Tạm thời dùng timestamp, sau này dùng Snowflake ID hoặc Sequence DB)
	orderID := uint64(time.Now().UnixNano())

	// 3. Tạo Command chuẩn format Rust
	cmd := models.Command{
		Type: "Place",
		Data: models.OrderData{
			ID:        orderID,
			UserID:    userID,
			Symbol:    req.Symbol,
			Price:     req.Price,
			Amount:    req.Amount,
			Side:      req.Side,
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
