package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Trading Platform Gateway",
		ServerHeader: "Gateway",
		ErrorHandler: customErrorHandler,
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("CORS_ORIGINS"),
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	// Routes
	setupRoutes(app)

	// Start server
	port := os.Getenv("GATEWAY_PORT")
	if port == "" {
		port = "8080"
	}

	// Graceful shutdown
	go func() {
		if err := app.Listen(":" + port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Printf("🚀 Gateway server started on port %s", port)

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
}

func setupRoutes(app *fiber.App) {
	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "gateway",
		})
	})

	// API v1 routes
	api := app.Group("/api/v1")
	
	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/register", handleRegister)
	auth.Post("/login", handleLogin)
	auth.Post("/logout", handleLogout)

	// Trading routes (protected)
	trading := api.Group("/trading")
	trading.Post("/orders", handleCreateOrder)
	trading.Get("/orders/:id", handleGetOrder)
	trading.Delete("/orders/:id", handleCancelOrder)
	trading.Get("/orderbook/:symbol", handleGetOrderBook)

	// Market data routes
	market := api.Group("/market")
	market.Get("/ticker/:symbol", handleGetTicker)
	market.Get("/trades/:symbol", handleGetTrades)

	// User routes (protected)
	user := api.Group("/user")
	user.Get("/profile", handleGetProfile)
	user.Get("/balance", handleGetBalance)
	user.Get("/orders", handleGetUserOrders)
	user.Get("/trades", handleGetUserTrades)
}

func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(fiber.Map{
		"error": err.Error(),
	})
}

// Handler stubs (implement in separate files)
func handleRegister(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Register endpoint"})
}

func handleLogin(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Login endpoint"})
}

func handleLogout(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Logout endpoint"})
}

func handleCreateOrder(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Create order endpoint"})
}

func handleGetOrder(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get order endpoint"})
}

func handleCancelOrder(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Cancel order endpoint"})
}

func handleGetOrderBook(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get orderbook endpoint"})
}

func handleGetTicker(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get ticker endpoint"})
}

func handleGetTrades(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get trades endpoint"})
}

func handleGetProfile(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get profile endpoint"})
}

func handleGetBalance(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get balance endpoint"})
}

func handleGetUserOrders(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get user orders endpoint"})
}

func handleGetUserTrades(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Get user trades endpoint"})
}
