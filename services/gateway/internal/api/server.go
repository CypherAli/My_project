package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nats-io/nats.go"
	"github.com/trading-platform/gateway/internal/api/handlers"
	"github.com/trading-platform/gateway/internal/config"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
)

// Server serves HTTP requests for our trading service
type Server struct {
	config   config.Config
	store    db.Store
	router   *gin.Engine
	natsConn *nats.Conn // NATS connection
}

// NewServer creates a new HTTP server and setup routing
func NewServer(cfg config.Config, store db.Store, nc *nats.Conn) *Server {
	server := &Server{
		config:   cfg,
		store:    store,
		natsConn: nc,
	}
	router := gin.Default()

	// Setup CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// Create handlers
	userHandler := handlers.NewUserHandler(cfg, store)
	accountHandler := handlers.NewAccountHandler(store)
	orderHandler := handlers.NewOrderHandler(nc) // NATS Order Handler

	// --- NHÓM PUBLIC ROUTES (Ai cũng gọi được) ---
	router.POST("/api/v1/auth/register", userHandler.RegisterUser)
	router.POST("/api/v1/auth/login", userHandler.LoginUser)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "gateway"})
	})

	// --- NHÓM PRIVATE ROUTES (Phải có Token mới gọi được) ---
	// Tạo một nhóm route được bảo vệ bởi authMiddleware
	authRoutes := router.Group("/").Use(authMiddleware(cfg.JWT.Secret))

	// Account routes (protected)
	authRoutes.GET("/api/v1/accounts", accountHandler.ListAccounts)
	authRoutes.POST("/api/v1/accounts/deposit", accountHandler.AddDeposit)
	authRoutes.GET("/api/v1/accounts/:currency", accountHandler.GetAccountBalance)

	// Order routes (protected)
	authRoutes.POST("/api/v1/orders", orderHandler.PlaceOrder)

	// Tạm thời thử nghiệm: Route lấy thông tin User hiện tại
	authRoutes.GET("/api/v1/users/me", func(ctx *gin.Context) {
		// Lấy lại payload đã lưu ở bước middleware
		payload := ctx.MustGet(authorizationPayloadKey).(*util.Payload)
		ctx.JSON(http.StatusOK, gin.H{"message": "Hello " + payload.Username})
	})

	server.router = router
	return server
}

// Start runs the HTTP server on a specific address
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
