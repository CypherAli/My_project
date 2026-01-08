package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/trading-platform/gateway/internal/api/handlers"
	"github.com/trading-platform/gateway/internal/config"
	"github.com/trading-platform/gateway/internal/util"
)

// Server serves HTTP requests for our trading service
type Server struct {
	config config.Config
	router *gin.Engine
}

// NewServer creates a new HTTP server and setup routing
func NewServer(cfg config.Config) *Server {
	server := &Server{
		config: cfg,
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

	// Create user handler (for demo, we'll pass nil for store - implement later)
	userHandler := handlers.NewUserHandler(cfg)

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
