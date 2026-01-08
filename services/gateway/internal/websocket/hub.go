package websocket

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// Upgrader dùng để nâng cấp kết nối HTTP thành WebSocket
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// Quan trọng: Cho phép mọi nguồn kết nối (tránh lỗi CORS khi dev)
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Hub quản lý tất cả clients đang kết nối
type Hub struct {
	clients    map[*websocket.Conn]bool // Danh sách clients
	broadcast  chan []byte              // Kênh nhận tin để bắn cho tất cả
	register   chan *websocket.Conn     // Kênh đăng ký user mới
	unregister chan *websocket.Conn     // Kênh hủy đăng ký
	mu         sync.Mutex               // Khóa để tránh race condition
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
		clients:    make(map[*websocket.Conn]bool),
	}
}

// Run là vòng lặp chính của Hub
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			log.Println("🔌 Client connected. Total:", len(h.clients))

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Close()
			}
			h.mu.Unlock()
			log.Println("🔌 Client disconnected. Total:", len(h.clients))

		case message := <-h.broadcast:
			// Khi nhận được tin (từ Redis), bắn cho TẤT CẢ client
			h.mu.Lock()
			for client := range h.clients {
				err := client.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Printf("❌ WS Error: %v", err)
					client.Close()
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

// HandleWebSocket là handler cho Gin Route
func (h *Hub) HandleWebSocket(ctx *gin.Context) {
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Println("Failed to upgrade websocket:", err)
		return
	}
	h.register <- conn
}

// BroadcastToClients giúp các package khác gọi gửi tin
func (h *Hub) BroadcastToClients(message []byte) {
	h.broadcast <- message
}
