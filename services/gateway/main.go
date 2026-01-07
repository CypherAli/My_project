package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/trading-platform/gateway/api"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// 1. Kết nối Database
	// Hardcode để test
	connString := "host=localhost port=5433 user=trading_user password=trading_password dbname=trading_db sslmode=disable"

	conn, err := sql.Open("postgres", connString)
	if err != nil {
		log.Fatal("cannot connect to db:", err)
	}
	defer conn.Close()

	// Test connection
	if err := conn.Ping(); err != nil {
		log.Fatal("cannot ping db:", err)
	}

	log.Println("✅ Database connected successfully")

	// 2. Khởi tạo Store từ sqlc
	store := db.New(conn)

	// 3. Khởi tạo Server
	server := api.NewServer(store)

	// 4. Chạy Server
	port := os.Getenv("GATEWAY_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s...\n", port)
	err = server.Start("0.0.0.0:" + port)
	if err != nil {
		log.Fatal("cannot start server:", err)
	}
}
