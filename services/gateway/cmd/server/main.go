package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/nats-io/nats.go"
	"github.com/trading-platform/gateway/internal/api"
	"github.com/trading-platform/gateway/internal/config"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
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

	// Create and start server
	server := api.NewServer(*cfg, store, nc)

	address := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("🚀 Gateway server starting on port %s", cfg.Server.Port)

	if err := server.Start(address); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
