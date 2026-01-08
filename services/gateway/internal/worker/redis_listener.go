package worker

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
	"github.com/trading-platform/gateway/internal/websocket"
)

type RedisListener struct {
	rdb *redis.Client
	hub *websocket.Hub
}

func NewRedisListener(redisAddr string, hub *websocket.Hub) *RedisListener {
	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	return &RedisListener{rdb: rdb, hub: hub}
}

func (l *RedisListener) Start() {
	ctx := context.Background()

	// Subscribe kênh mà Rust đang bắn tin vào
	// (Lưu ý: Tên kênh phải khớp với Rust: "ob_update:BTC/USDT")
	pubsub := l.rdb.Subscribe(ctx, "ob_update:BTC/USDT")
	defer pubsub.Close()

	log.Println("📡 Listening to Redis Channel: ob_update:BTC/USDT")

	ch := pubsub.Channel()

	for msg := range ch {
		// Log chơi chơi để biết có tin
		// log.Printf("🔥 Redis Update: %s", msg.Payload)

		// Bắn tin này vào WebSocket Hub -> Đến tay người dùng
		l.hub.BroadcastToClients([]byte(msg.Payload))
	}
}
