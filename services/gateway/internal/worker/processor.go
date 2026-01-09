package worker

import (
	"context"
	"encoding/json"
	"log"

	"github.com/nats-io/nats.go"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/models"
	"github.com/trading-platform/gateway/internal/websocket"
)

// EventProcessor xử lý các event từ Rust Engine
type EventProcessor struct {
	store    db.Store
	natsConn *nats.Conn
	hub      *websocket.Hub // Thêm Hub để broadcast trades
}

// NewEventProcessor tạo processor mới
func NewEventProcessor(store db.Store, nc *nats.Conn, hub *websocket.Hub) *EventProcessor {
	return &EventProcessor{
		store:    store,
		natsConn: nc,
		hub:      hub,
	}
}

// Start bắt đầu lắng nghe events từ NATS
func (p *EventProcessor) Start(ctx context.Context) error {
	log.Println("🎧 Starting Event Processor...")

	// Subscribe vào topic "events" (Rust Engine sẽ publish vào đây)
	_, err := p.natsConn.Subscribe("events", func(msg *nats.Msg) {
		p.handleEvent(msg.Data)
	})

	if err != nil {
		return err
	}

	log.Println("✅ Event Processor started successfully")

	// Chờ cho đến khi context bị cancel
	<-ctx.Done()
	return nil
}

// handleEvent xử lý từng event nhận được
func (p *EventProcessor) handleEvent(data []byte) {
	log.Printf("📩 Received event: %s", string(data))

	// Parse event chung
	var event models.EngineEvent
	if err := json.Unmarshal(data, &event); err != nil {
		log.Printf("❌ Error parsing event: %v", err)
		return
	}

	// Xử lý theo loại event
	switch event.Type {
	case "OrderPlaced":
		p.handleOrderPlaced(event.Data)
	case "TradeExecuted":
		p.handleTradeExecuted(event.Data)
	case "OrderCancelled":
		p.handleOrderCancelled(event.Data)
	default:
		log.Printf("⚠️  Unknown event type: %s", event.Type)
	}
}

// handleOrderPlaced xử lý event OrderPlaced
func (p *EventProcessor) handleOrderPlaced(data interface{}) {
	// Parse data thành struct cụ thể
	jsonData, _ := json.Marshal(data)
	var orderData models.OrderPlacedData
	if err := json.Unmarshal(jsonData, &orderData); err != nil {
		log.Printf("❌ Error parsing OrderPlaced data: %v", err)
		return
	}

	log.Printf("📝 Processing OrderPlaced: Order ID %d, Symbol %s", orderData.OrderID, orderData.Symbol)

	// Lưu order vào database
	arg := db.CreateOrderParams{
		ID:     int64(orderData.OrderID),
		UserID: int64(orderData.UserID),
		Symbol: orderData.Symbol,
		Price:  orderData.Price,
		Amount: orderData.Amount,
		Side:   orderData.Side,
	}

	_, err := p.store.CreateOrder(context.Background(), arg)
	if err != nil {
		log.Printf("❌ Failed to store order in DB: %v", err)
		return
	}

	log.Printf("✅ DB Updated: Order %d stored successfully", orderData.OrderID)
}

// handleTradeExecuted xử lý event TradeExecuted
func (p *EventProcessor) handleTradeExecuted(data interface{}) {
	// Parse data thành struct cụ thể
	jsonData, _ := json.Marshal(data)
	var tradeData models.TradeExecutedData
	if err := json.Unmarshal(jsonData, &tradeData); err != nil {
		log.Printf("❌ Error parsing TradeExecuted data: %v", err)
		return
	}

	log.Printf("💰 Processing TradeExecuted: Trade ID %d", tradeData.Trade.TradeID)

	// Lưu trade vào database
	arg := db.CreateTradeParams{
		MakerOrderID: int64(tradeData.Trade.SellerOrderID), // Seller là maker (đặt lệnh trước)
		TakerOrderID: int64(tradeData.Trade.BuyerOrderID),  // Buyer là taker (khớp vào)
		Price:        tradeData.Trade.Price,
		Amount:       tradeData.Trade.Amount,
	}

	_, err := p.store.CreateTrade(context.Background(), arg)
	if err != nil {
		log.Printf("❌ Failed to store trade in DB: %v", err)
		return
	}

	log.Printf("💰 DB Updated: Trade stored %s @ %s", tradeData.Trade.Amount, tradeData.Trade.Price)

	// Broadcast trade event to WebSocket clients for chart
	msg := map[string]interface{}{
		"type": "trade",
		"data": tradeData.Trade,
	}
	jsonMsg, _ := json.Marshal(msg)
	p.hub.BroadcastToClients(jsonMsg)

	log.Printf("📊 Trade broadcasted to WebSocket clients")

	// TODO Nâng cao: Sau này sẽ cập nhật số dư (UpdateBalance) tại đây.
	// Ví dụ: Cộng tiền cho người bán, Trừ tiền người mua (nếu chưa trừ lúc đặt).
}

// handleOrderCancelled xử lý event OrderCancelled
func (p *EventProcessor) handleOrderCancelled(data interface{}) {
	// Parse data thành struct cụ thể
	jsonData, _ := json.Marshal(data)
	var cancelData models.OrderCancelledData
	if err := json.Unmarshal(jsonData, &cancelData); err != nil {
		log.Printf("❌ Error parsing OrderCancelled data: %v", err)
		return
	}

	log.Printf("🚫 Processing OrderCancelled: Order ID %d, Success: %v",
		cancelData.OrderID, cancelData.Success)

	// TODO: Cập nhật status trong database
}
