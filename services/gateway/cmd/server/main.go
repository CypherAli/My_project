package main

import (
	"fmt"
	"log"

	"github.com/trading-platform/gateway/internal/api"
	"github.com/trading-platform/gateway/internal/config"
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

	// Create and start server
	server := api.NewServer(*cfg)

	address := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("🚀 Gateway server starting on port %s", cfg.Server.Port)

	if err := server.Start(address); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
