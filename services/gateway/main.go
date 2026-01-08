package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	"github.com/trading-platform/gateway/api"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
)

func main() {
	// 1. Load Config từ file .env
	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatal("cannot load config:", err)
	}

	// 2. Kết nối Database (sử dụng config.DBSource)
	conn, err := sql.Open("postgres", config.DBSource)
	if err != nil {
		log.Fatal("cannot connect to db:", err)
	}
	defer conn.Close()

	// Test connection
	if err := conn.Ping(); err != nil {
		log.Fatal("cannot ping db:", err)
	}

	log.Println("✅ Database connected successfully")

	// 3. Khởi tạo Store từ sqlc
	store := db.New(conn)

	// 4. Khởi tạo Server (truyền config vào)
	server := api.NewServer(config, store)

	// 5. Chạy Server (sử dụng config.ServerAddress)
	log.Printf("🚀 Server starting on %s...\n", config.ServerAddress)
	err = server.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("cannot start server:", err)
	}
}
