package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nats-io/nats.go"
	"github.com/trading-platform/gateway/internal/api"
	"github.com/trading-platform/gateway/internal/config"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/websocket"
	"github.com/trading-platform/gateway/internal/worker"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Cannot load config: %v", err)
	}

	// Validate configuration
	if err := cfg.Validate(); err != nil {
		log.Fatalf("Invalid configuration: %v", err)
	}

	// Khởi tạo Database Connection Pool
	ctx := context.Background()
	connPool, err := pgxpool.New(ctx, cfg.Database.DBSource)
	if err != nil {
		log.Fatalf("Cannot connect to database: %v", err)
	}
	defer connPool.Close()

	// Test database connection
	if err := connPool.Ping(ctx); err != nil {
		log.Fatalf("Cannot ping database: %v", err)
	}

	log.Println("✅ Database connected successfully")

	// Tạo Store để quản lý database operations
	store := db.NewStore(connPool)

	// Kết nối NATS
	log.Println("🔌 Connecting to NATS...")
	nc, err := nats.Connect("nats://localhost:4222")
	if err != nil {
		log.Fatalf("Cannot connect to NATS: %v", err)
	}
	defer nc.Close()
	log.Println("✅ NATS connected successfully")

	// 1. Khởi tạo WebSocket Hub (di chuyển lên trước để có thể dùng trong processor)
	log.Println("🔌 Initializing WebSocket Hub...")
	wsHub := websocket.NewHub()
	go wsHub.Run() // Chạy Hub ngầm

	// Khởi động Event Processor (Worker) trong goroutine riêng
	log.Println("🔧 Starting Event Processor Worker...")
	processor := worker.NewEventProcessor(store, nc, wsHub) // Truyền wsHub vào

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		if err := processor.Start(ctx); err != nil {
			log.Fatalf("Event processor error: %v", err)
		}
	}()

	// 2. Khởi tạo Redis Listener để cầu nối dữ liệu
	log.Println("📡 Starting Redis Listener...")
	redisAddr := os.Getenv("REDIS_URL")
	if redisAddr == "" {
		redisAddr = "localhost:6379" // Default Redis address
	}
	redisListener := worker.NewRedisListener(redisAddr, wsHub)
	go redisListener.Start() // Chạy Listener ngầm

	// Create and start server
	server := api.NewServer(*cfg, store, nc, wsHub)

	address := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("🚀 Gateway server starting on port %s", cfg.Server.Port)

	// Graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-sigChan
		log.Println("🛑 Shutting down gracefully...")
		cancel() // Cancel context to stop worker
	}()

	if err := server.Start(address); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
