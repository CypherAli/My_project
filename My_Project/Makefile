.PHONY: help up down restart logs ps clean build test migrate seed

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

##@ General

help: ## Display this help message
	@echo "$(BLUE)High-Frequency Trading Platform - Makefile Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Docker Operations

up: ## Start all services
	@echo "$(BLUE)Starting all services...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ All services started$(NC)"
	@$(MAKE) ps

down: ## Stop all services
	@echo "$(BLUE)Stopping all services...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ All services stopped$(NC)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting all services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ All services restarted$(NC)"

ps: ## Show running services
	@docker-compose ps

logs: ## View logs (use SERVICE=name for specific service)
	@docker-compose logs -f $(SERVICE)

logs-gateway: ## View gateway service logs
	@docker-compose logs -f gateway

logs-engine: ## View matching engine logs
	@docker-compose logs -f matching-engine

logs-frontend: ## View frontend logs
	@docker-compose logs -f frontend

logs-db: ## View database logs
	@docker-compose logs -f postgres redis

logs-infra: ## View infrastructure logs
	@docker-compose logs -f nats prometheus grafana

##@ Build Operations

build: ## Build all services
	@echo "$(BLUE)Building all services...$(NC)"
	docker-compose build
	@echo "$(GREEN)✓ All services built$(NC)"

build-gateway: ## Build gateway service
	@echo "$(BLUE)Building gateway service...$(NC)"
	docker-compose build gateway
	@echo "$(GREEN)✓ Gateway service built$(NC)"

build-engine: ## Build matching engine
	@echo "$(BLUE)Building matching engine...$(NC)"
	docker-compose build matching-engine
	@echo "$(GREEN)✓ Matching engine built$(NC)"

build-frontend: ## Build frontend
	@echo "$(BLUE)Building frontend...$(NC)"
	docker-compose build frontend
	@echo "$(GREEN)✓ Frontend built$(NC)"

rebuild: ## Rebuild all services (no cache)
	@echo "$(BLUE)Rebuilding all services (no cache)...$(NC)"
	docker-compose build --no-cache
	@echo "$(GREEN)✓ All services rebuilt$(NC)"

##@ Database Operations

db-shell: ## Access PostgreSQL shell
	@docker-compose exec postgres psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	docker-compose exec gateway /app/bin/migrate up
	@echo "$(GREEN)✓ Migrations completed$(NC)"

db-migrate-down: ## Rollback last migration
	@echo "$(BLUE)Rolling back migration...$(NC)"
	docker-compose exec gateway /app/bin/migrate down
	@echo "$(GREEN)✓ Migration rolled back$(NC)"

db-seed: ## Seed database with test data
	@echo "$(BLUE)Seeding database...$(NC)"
	docker-compose exec gateway /app/bin/seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

db-reset: ## Reset database (drop and recreate)
	@echo "$(RED)Resetting database...$(NC)"
	docker-compose exec postgres psql -U $(POSTGRES_USER) -c "DROP DATABASE IF EXISTS $(POSTGRES_DB);"
	docker-compose exec postgres psql -U $(POSTGRES_USER) -c "CREATE DATABASE $(POSTGRES_DB);"
	@$(MAKE) db-migrate
	@echo "$(GREEN)✓ Database reset$(NC)"

##@ Cache Operations

redis-cli: ## Access Redis CLI
	@docker-compose exec redis redis-cli

redis-flush: ## Flush all Redis data
	@echo "$(RED)Flushing Redis data...$(NC)"
	docker-compose exec redis redis-cli FLUSHALL
	@echo "$(GREEN)✓ Redis flushed$(NC)"

##@ Testing

test: ## Run all tests
	@echo "$(BLUE)Running all tests...$(NC)"
	@$(MAKE) test-gateway
	@$(MAKE) test-engine
	@$(MAKE) test-frontend
	@echo "$(GREEN)✓ All tests passed$(NC)"

test-gateway: ## Run gateway tests
	@echo "$(BLUE)Running gateway tests...$(NC)"
	cd services/gateway && go test -v -race -cover ./...

test-engine: ## Run matching engine tests
	@echo "$(BLUE)Running matching engine tests...$(NC)"
	cd services/matching-engine && cargo test --all-features

test-frontend: ## Run frontend tests
	@echo "$(BLUE)Running frontend tests...$(NC)"
	cd services/frontend && npm test

test-integration: ## Run integration tests
	@echo "$(BLUE)Running integration tests...$(NC)"
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit
	docker-compose -f docker-compose.test.yml down

##@ Code Quality

lint: ## Run linters
	@$(MAKE) lint-gateway
	@$(MAKE) lint-engine
	@$(MAKE) lint-frontend

lint-gateway: ## Lint Go code
	@echo "$(BLUE)Linting gateway...$(NC)"
	cd services/gateway && golangci-lint run

lint-engine: ## Lint Rust code
	@echo "$(BLUE)Linting matching engine...$(NC)"
	cd services/matching-engine && cargo clippy -- -D warnings

lint-frontend: ## Lint frontend code
	@echo "$(BLUE)Linting frontend...$(NC)"
	cd services/frontend && npm run lint

format: ## Format all code
	@$(MAKE) format-gateway
	@$(MAKE) format-engine
	@$(MAKE) format-frontend

format-gateway: ## Format Go code
	@echo "$(BLUE)Formatting gateway...$(NC)"
	cd services/gateway && go fmt ./...

format-engine: ## Format Rust code
	@echo "$(BLUE)Formatting matching engine...$(NC)"
	cd services/matching-engine && cargo fmt

format-frontend: ## Format frontend code
	@echo "$(BLUE)Formatting frontend...$(NC)"
	cd services/frontend && npm run format

##@ Monitoring

monitoring: ## Open monitoring dashboards
	@echo "$(BLUE)Opening monitoring dashboards...$(NC)"
	@echo "Grafana: http://localhost:3001 (admin/admin)"
	@echo "Prometheus: http://localhost:9090"
	@echo "NATS Monitoring: http://localhost:8222"

##@ Cleanup

clean: ## Remove all containers, volumes, and data
	@echo "$(RED)Cleaning up all resources...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

clean-volumes: ## Remove all volumes
	@echo "$(RED)Removing all volumes...$(NC)"
	docker volume rm trading-postgres-data trading-redis-data trading-nats-data trading-prometheus-data trading-grafana-data || true
	@echo "$(GREEN)✓ Volumes removed$(NC)"

prune: ## Remove all unused Docker resources
	@echo "$(RED)Pruning Docker resources...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)✓ Docker pruned$(NC)"

##@ Development

dev-gateway: ## Run gateway in development mode
	@echo "$(BLUE)Starting gateway in development mode...$(NC)"
	cd services/gateway && air

dev-engine: ## Run matching engine in development mode
	@echo "$(BLUE)Starting matching engine in development mode...$(NC)"
	cd services/matching-engine && cargo watch -x run

dev-frontend: ## Run frontend in development mode
	@echo "$(BLUE)Starting frontend in development mode...$(NC)"
	cd services/frontend && npm run dev

setup: ## Initial setup (copy env, build, start)
	@echo "$(BLUE)Setting up project...$(NC)"
	@if [ ! -f .env ]; then cp .env.example .env; echo "$(GREEN)✓ Created .env file$(NC)"; fi
	@$(MAKE) build
	@$(MAKE) up
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo "$(YELLOW)Access the services:$(NC)"
	@echo "  Gateway API: http://localhost:8080"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Grafana: http://localhost:3001"

health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo ""
	@echo "$(YELLOW)PostgreSQL:$(NC)"
	@docker-compose exec postgres pg_isready -U $(POSTGRES_USER) || echo "$(RED)✗ Not healthy$(NC)"
	@echo ""
	@echo "$(YELLOW)Redis:$(NC)"
	@docker-compose exec redis redis-cli ping || echo "$(RED)✗ Not healthy$(NC)"
	@echo ""
	@echo "$(YELLOW)NATS:$(NC)"
	@curl -s http://localhost:8222/healthz > /dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Not healthy$(NC)"

##@ Utility

shell-gateway: ## Shell into gateway container
	@docker-compose exec gateway sh

shell-engine: ## Shell into matching engine container
	@docker-compose exec matching-engine sh

shell-frontend: ## Shell into frontend container
	@docker-compose exec frontend sh

env: ## Show environment variables
	@docker-compose config
