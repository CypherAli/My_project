package api

import (
	"github.com/gin-gonic/gin"
	"github.com/trading-platform/gateway/api/handlers"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
)

type Server struct {
	store  *db.Queries
	router *gin.Engine
	config util.Config
}

func NewServer(config util.Config, store *db.Queries) *Server {
	server := &Server{
		store:  store,
		config: config,
	}
	router := gin.Default()

	// Khởi tạo handler (truyền cả store và config)
	userHandler := handlers.NewUserHandler(store, config)

	// Định nghĩa Routes
	router.POST("/api/v1/auth/register", userHandler.RegisterUser)
	router.POST("/api/v1/auth/login", userHandler.LoginUser)

	server.router = router
	return server
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
