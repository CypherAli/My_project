# High-Frequency Stock Trading Platform

A production-grade, polyglot microservices-based trading platform designed for high performance and scalability.

## 🏗️ Architecture

### Services

- **Gateway Service** (Go): REST API, WebSocket, Authentication
- **Matching Engine** (Rust): High-performance order matching
- **Frontend** (Next.js): Trading interface

### Infrastructure

- **PostgreSQL**: Primary database
- **Redis**: Caching and pub/sub
- **NATS JetStream**: Event streaming
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Make
- Go 1.22+
- Rust 1.75+
- Node.js 20+

### Setup

1. Clone the repository
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Start all services:
   ```bash
   make up
   ```

### Available Commands

```bash
make up              # Start all services
make down            # Stop all services
make logs            # View logs
make ps              # Show running services
make restart         # Restart all services
make clean           # Clean volumes and data
make db-migrate      # Run database migrations
make test            # Run all tests
make build-gateway   # Build gateway service
make build-engine    # Build matching engine
make build-frontend  # Build frontend
```

## 📁 Project Structure

```
trading-platform/
├── services/
│   ├── gateway/         # Go service
│   ├── matching-engine/ # Rust service
│   └── frontend/        # Next.js app
├── infrastructure/
│   ├── docker/
│   ├── monitoring/
│   └── scripts/
├── shared/
│   └── proto/           # Protobuf definitions
└── docker-compose.yml
```

## 🔧 Development

### Gateway Service (Go)

```bash
cd services/gateway
go run cmd/server/main.go
```

### Matching Engine (Rust)

```bash
cd services/matching-engine
cargo run
```

### Frontend

```bash
cd services/frontend
npm run dev
```

## 📊 Monitoring

- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9090

## 🔐 Environment Variables

See `.env.example` for all required configuration variables.

## 📝 License

MIT
