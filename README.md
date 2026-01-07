# High-Frequency Trading Platform 🚀

A production-grade, polyglot microservices-based trading platform designed for high performance, low latency, and scalability.

[![GitHub](https://img.shields.io/badge/GitHub-CypherAli%2FMy__project-blue)](https://github.com/CypherAli/My_project)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🏗️ Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **API Gateway** | Go 1.22+ | REST/WebSocket API, Authentication, Rate Limiting |
| **Matching Engine** | Rust 1.75+ | High-performance order matching (<1ms latency) |
| **Database** | PostgreSQL 16 | Persistent storage with ACID guarantees |
| **Cache** | Redis 7 | Session management, real-time data |
| **Message Queue** | NATS JetStream | Event streaming, pub/sub |
| **Monitoring** | Prometheus + Grafana | Metrics and dashboards |

### System Design

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│  Go Gateway  │────▶│   Postgres   │
│   (Next.js)  │     │   REST API   │     │   Database   │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐     ┌──────────────┐
                     │ NATS Stream  │────▶│ Rust Matching│
                     │  (Events)    │     │    Engine    │
                     └──────────────┘     └──────────────┘
```

## 🚀 Quick Start (Windows)

### Prerequisites

**Required:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with WSL2)
- [Git for Windows](https://gitforwindows.org/)

**Will be installed automatically:**
- Scoop (package manager)
- golang-migrate (database migrations)

### Setup Steps

1. **Clone the repository**
   ```powershell
   git clone https://github.com/CypherAli/My_project.git
   cd My_project
   ```

2. **Start Docker Desktop** (make sure it's running)

3. **Start infrastructure**
   ```powershell
   docker-compose up -d postgres redis nats
   ```
   Wait ~30 seconds for PostgreSQL to be ready.

4. **Run database migrations**
   
   If you don't have `migrate` installed:
   ```powershell
   # Install Scoop (package manager)
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
   
   # Install migrate tool
   scoop install migrate
   ```
   
   Then run migrations:
   ```powershell
   migrate -path services/gateway/migrations -database "postgresql://trading_user:trading_password@localhost:5432/trading_db?sslmode=disable" up
   ```

5. **Verify database**
   ```powershell
   docker exec trading-postgres psql -U trading_user -d trading_db -c '\dt'
   ```
   You should see 15 tables.

6. **Start all services**
   ```powershell
   docker-compose up -d
   ```

### Available Commands (PowerShell)

```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# View specific service logs
docker-compose logs -f gateway
docker-compose logs -f matching-engine

# Database operations
docker exec trading-postgres psql -U trading_user -d trading_db

# Redis CLI
docker exec -it trading-redis redis-cli

# Check service status
docker-compose ps
```

## 📁 Project Structure

```
My_Project/
├── services/
│   ├── gateway/                    # Go API Gateway
│   │   ├── cmd/server/            # Entry point
│   │   ├── internal/              # Business logic
│   │   │   ├── api/               # HTTP handlers
│   │   │   ├── auth/              # Authentication
│   │   │   ├── database/          # DB connections
│   │   │   ├── middleware/        # HTTP middleware
│   │   │   ├── models/            # Data models
│   │   │   ├── repository/        # Data access layer
│   │   │   ├── service/           # Business logic
│   │   │   └── websocket/         # WebSocket handlers
│   │   ├── migrations/            # Database migrations
│   │   └── Dockerfile
│   │
│   └── matching-engine/            # Rust Matching Engine
│       ├── src/
│       │   ├── main.rs            # Entry point
│       │   ├── engine.rs          # Matching logic
│       │   ├── orderbook.rs       # Order book data structure
│       │   ├── types.rs           # Type definitions
│       │   ├── messaging.rs       # NATS integration
│       │   └── config.rs          # Configuration
│       └── Cargo.toml
│
├── infrastructure/
│   ├── docker/
│   │   └── postgres/
│   │       └── init.sql           # Initial DB setup
│   └── monitoring/
│       ├── prometheus/            # Metrics config
│       └── grafana/               # Dashboards
│
├── docker-compose.yml             # Service orchestration
├── Makefile                       # Build automation
├── DATABASE_REVIEW.md             # Database documentation
└── README.md                      # This file
```

## 📊 Database Schema

The platform includes a comprehensive database schema with **15 tables**:

### Core Tables
- **users** - User accounts and profiles
- **accounts** - Trading accounts per user/currency
- **currencies** - Supported currencies (8 pre-configured: BTC, ETH, USD, USDT, etc.)
- **trading_pairs** - Trading pairs (BTC/USD, ETH/BTC, etc.)

### Trading Tables
- **orders** - All orders (limit, market, stop, stop-limit)
- **trades** - Executed trades with maker/taker info
- **transactions** - Account transaction history

### Fee Management
- **fee_tiers** - Fee tiers based on 30-day volume
  - Standard: 0.10% maker / 0.20% taker
  - VIP 1: 0.05% maker / 0.10% taker
  - VIP 2: 0.02% maker / 0.08% taker
  - VIP 3: 0.00% maker / 0.05% taker
- **user_fee_tiers** - User tier assignments

### Performance & Security
- **orderbook_snapshots** - Order book persistence for recovery
- **order_metrics** - Performance metrics (fill time, throughput)
- **sessions** - User sessions
- **api_keys** - API key management
- **audit_logs** - System audit trail

**Key Features:**
- ✅ `DECIMAL(20, 8)` for all monetary values (no floating-point errors)
- ✅ Comprehensive constraints ensuring data integrity
- ✅ Optimized indexes for <1ms order matching
- ✅ Foreign key relationships with cascade rules

📚 See [DATABASE_REVIEW.md](DATABASE_REVIEW.md) for detailed technical documentation.

## 🔧 Development

### Local Development (without Docker)

#### Gateway Service (Go)
```powershell
cd services/gateway
go mod download
go run cmd/server/main.go
```

#### Matching Engine (Rust)
```powershell
cd services/matching-engine
cargo build
cargo run
```

### Testing

```powershell
# Test Go Gateway
cd services/gateway
go test -v ./...

# Test Rust Engine
cd services/matching-engine
cargo test

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 🔐 Security

- JWT-based authentication
- API key management for trading bots
- Rate limiting (100 requests/minute default)
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention via prepared statements

## 📈 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Order matching latency | <1ms | ✅ In-memory BTreeMap |
| Database write latency | <10ms | ✅ Indexed & async |
| Orders per second | 10,000+ | ✅ Batch processing |
| Concurrent users | 100,000+ | ✅ Horizontal scaling |
| WebSocket latency | <50ms | 🔄 In development |

## 🐛 Troubleshooting

### Database connection errors
```powershell
# Check if PostgreSQL is running
docker ps | Select-String postgres

# Check database credentials
docker inspect trading-postgres --format='{{range .Config.Env}}{{println .}}{{end}}'

# Reset database
docker-compose down -v
docker-compose up -d postgres
# Wait 30s, then run migrations again
```

### Migration errors
```powershell
# Check current version
migrate -path services/gateway/migrations -database "postgresql://trading_user:trading_password@localhost:5432/trading_db?sslmode=disable" version

# Force version (if dirty)
migrate -path services/gateway/migrations -database "postgresql://trading_user:trading_password@localhost:5432/trading_db?sslmode=disable" force 1

# Drop and recreate
migrate -path services/gateway/migrations -database "postgresql://trading_user:trading_password@localhost:5432/trading_db?sslmode=disable" drop -f
migrate -path services/gateway/migrations -database "postgresql://trading_user:trading_password@localhost:5432/trading_db?sslmode=disable" up
```

### Docker issues
```powershell
# Clean restart
docker-compose down -v
docker system prune -a --volumes
docker-compose up -d
```

## 📊 Monitoring

Access monitoring dashboards:
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Gateway API**: http://localhost:8080
- **Gateway Health**: http://localhost:8080/health

## 🔐 Environment Variables

See [.env.example](.env.example) for all required configuration.

**Critical variables:**
```env
DATABASE_URL=postgresql://trading_user:trading_password@localhost:5432/trading_db
JWT_SECRET=<change-this-in-production>
APP_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [DATABASE_REVIEW.md](DATABASE_REVIEW.md) - Database schema and optimization details
- [PROJECT_README.md](PROJECT_README.md) - Original project documentation
- API documentation (Swagger): Coming soon

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

## 👥 Authors

- **CypherAli** - [GitHub](https://github.com/CypherAli)

## 🙏 Acknowledgments

- Binance API for inspiration
- PostgreSQL for reliable data storage
- Rust community for performance insights
