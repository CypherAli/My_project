# Gateway Service

High-performance API gateway built with Go and Fiber framework.

## Features

- RESTful API endpoints
- WebSocket support for real-time data
- JWT authentication
- Rate limiting
- CORS handling
- Connection to PostgreSQL, Redis, and NATS

## Project Structure

```
gateway/
├── cmd/
│   └── server/          # Main application entry point
├── internal/
│   ├── api/            # HTTP handlers
│   ├── auth/           # Authentication logic
│   ├── config/         # Configuration
│   ├── database/       # Database connections
│   ├── middleware/     # HTTP middleware
│   ├── models/         # Data models
│   ├── repository/     # Data access layer
│   ├── service/        # Business logic
│   └── websocket/      # WebSocket handlers
├── pkg/                # Public libraries
├── migrations/         # Database migrations
├── Dockerfile
├── go.mod
└── go.sum
```

## Development

```bash
# Run locally
go run cmd/server/main.go

# Run tests
go test -v ./...

# Build
go build -o bin/server cmd/server/main.go
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Trading
- `POST /api/v1/trading/orders` - Create order
- `GET /api/v1/trading/orders/:id` - Get order details
- `DELETE /api/v1/trading/orders/:id` - Cancel order
- `GET /api/v1/trading/orderbook/:symbol` - Get order book

### Market Data
- `GET /api/v1/market/ticker/:symbol` - Get ticker data
- `GET /api/v1/market/trades/:symbol` - Get recent trades

### User
- `GET /api/v1/user/profile` - Get user profile
- `GET /api/v1/user/balance` - Get account balance
- `GET /api/v1/user/orders` - Get user orders
- `GET /api/v1/user/trades` - Get user trade history
