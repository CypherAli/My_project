package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trading-platform/gateway/api/handlers"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
)

type Server struct {
	store  *db.Queries
	router *gin.Engine
}

func NewServer(store *db.Queries) *Server {
	server := &Server{store: store}
	router := gin.Default()

	// Khởi tạo handler
	userHandler := handlers.NewUserHandler(store)

	// Định nghĩa Routes
	router.POST("/api/v1/auth/register", userHandler.RegisterUser)
	// Sau này thêm: router.POST("/api/v1/auth/login", userHandler.LoginUser)

	server.router = router
	return server
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
