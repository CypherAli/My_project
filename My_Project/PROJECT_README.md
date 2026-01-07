# 🚀 High-Frequency Stock Trading Platform

A production-grade, polyglot microservices-based high-frequency trading platform built with **Go**, **Rust**, and **Next.js**.

## 🏗️ Architecture

This project follows a **monorepo** structure with the following services:

- **Gateway Service** (Go): REST API, WebSockets, Authentication
- **Matching Engine** (Rust): High-performance order matching
- **Frontend** (Next.js): Trading dashboard and UI
- **Infrastructure**: PostgreSQL, Redis, NATS JetStream, Prometheus, Grafana

## 📋 Prerequisites

- Docker & Docker Compose
- Make
- Go 1.22+ (for local development)
- Rust 1.75+ (for local development)
- Node.js 20+ (for local development)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd My_Project

# Copy environment file
cp .env.example .env

# Edit .env with your configurations
nano .env  # or your preferred editor
```

### 2. Start All Services

```bash
# Start the entire stack
make up

# View logs
make logs

# Check service status
make ps
```

### 3. Access Services

- **Frontend**: http://localhost:3000
- **Gateway API**: http://localhost:8080
- **Matching Engine**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **NATS Monitoring**: http://localhost:8222

## 📁 Project Structure

```
My_Project/
├── services/
│   ├── gateway/              # Go service
│   ├── matching-engine/      # Rust service
│   └── frontend/             # Next.js app
├── infrastructure/
│   ├── docker/              # Docker configs
│   └── monitoring/          # Prometheus & Grafana
├── docker-compose.yml
├── Makefile
└── .env.example
```

## 🛠️ Development

### Gateway Service (Go)

```bash
cd services/gateway
go mod download
go run cmd/server/main.go
```

### Matching Engine (Rust)

```bash
cd services/matching-engine
cargo build
cargo run
```

### Frontend (Next.js)

```bash
cd services/frontend
npm install
npm run dev
```

## 📦 Available Commands

```bash
make help              # Show all available commands
make up                # Start all services
make down              # Stop all services
make restart           # Restart all services
make logs              # View logs
make build             # Build all services
make test              # Run tests
make clean             # Clean up containers and volumes
```

## 🔧 Configuration

All configuration is managed through environment variables. See `.env.example` for all available options.

### Key Configuration Areas:

- **Database**: PostgreSQL connection settings
- **Redis**: Cache and pub/sub configuration
- **NATS**: Message broker settings
- **JWT**: Authentication secrets
- **Trading**: Order limits, fees, supported pairs

## 🧪 Testing

```bash
# Run all tests
make test

# Test specific service
make test-gateway
make test-engine
make test-frontend
```

## 📊 Monitoring

- **Prometheus**: Metrics collection at http://localhost:9090
- **Grafana**: Dashboards at http://localhost:3001
- **NATS Monitoring**: JetStream stats at http://localhost:8222

## 🔐 Security

- Change all default passwords in `.env`
- Use strong JWT secrets (min 32 characters)
- Enable HTTPS in production
- Review security settings in docker-compose.yml

## 🚀 Production Deployment

1. Set `ENV=production` in `.env`
2. Use proper secrets management (e.g., Docker secrets, Vault)
3. Configure proper networking and firewalls
4. Set up SSL/TLS certificates
5. Configure backup strategies for databases
6. Set up log aggregation

## 📝 API Documentation

API documentation will be available at:
- Swagger UI: http://localhost:8080/swagger
- OpenAPI Spec: http://localhost:8080/openapi.json

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Trading Platform Team - Capstone Project

## 🐛 Known Issues

- None at the moment

## 📚 Documentation

For detailed documentation, see the `docs/` directory (coming soon).

## 💡 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Go, Rust, and TypeScript**
