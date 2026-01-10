package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Redis    RedisConfig
	NATS     NATSConfig
	JWT      JWTConfig
	Log      LogConfig
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port           string
	WSPort         string
	ReadTimeout    time.Duration
	WriteTimeout   time.Duration
	MaxConnections int
	Environment    string
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	URL             string
	DBSource        string // Connection string cho pgxpool
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

// RedisConfig holds Redis configuration
type RedisConfig struct {
	URL      string
	Password string
	DB       int
}

// NATSConfig holds NATS configuration
type NATSConfig struct {
	URL string
}

// JWTConfig holds JWT configuration
type JWTConfig struct {
	Secret        string
	Expiry        time.Duration
	RefreshExpiry time.Duration
}

// LogConfig holds logging configuration
type LogConfig struct {
	Level  string
	Format string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if exists
	_ = godotenv.Load()

	return &Config{
		Server: ServerConfig{
			Port:           getEnv("GATEWAY_PORT", "8080"),
			WSPort:         getEnv("GATEWAY_WS_PORT", "8081"),
			ReadTimeout:    time.Second * 15,
			WriteTimeout:   time.Second * 15,
			MaxConnections: 10000,
			Environment:    getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			URL:             getEnv("DATABASE_URL", ""),
			DBSource:        getEnv("DB_SOURCE", getEnv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/trading_db?sslmode=disable")),
			MaxOpenConns:    25,
			MaxIdleConns:    25,
			ConnMaxLifetime: time.Minute * 5,
		},
		Redis: RedisConfig{
			URL:      getEnv("REDIS_URL", "redis://localhost:6379/0"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       0,
		},
		NATS: NATSConfig{
			URL: getEnv("NATS_URL", "nats://localhost:4222"),
		},
		JWT: JWTConfig{
			Secret:        getEnv("JWT_SECRET", "your-secret-key"),
			Expiry:        time.Hour * 24,
			RefreshExpiry: time.Hour * 24 * 7,
		},
		Log: LogConfig{
			Level:  getEnv("LOG_LEVEL", "info"),
			Format: getEnv("LOG_FORMAT", "json"),
		},
	}, nil
}

// Validate validates the configuration
func (c *Config) Validate() error {
	if c.Database.URL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}
	if c.JWT.Secret == "" || c.JWT.Secret == "your-secret-key" {
		return fmt.Errorf("JWT_SECRET must be set and not default value")
	}
	return nil
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
