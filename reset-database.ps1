#!/usr/bin/env pwsh
# Script to reset and reinitialize PostgreSQL database

Write-Host "Resetting PostgreSQL database..." -ForegroundColor Cyan

# Stop and remove containers with volumes
Write-Host "Stopping containers..." -ForegroundColor Yellow
docker-compose down -v 2>$null

# Remove any lingering volumes
Write-Host "Cleaning volumes..." -ForegroundColor Yellow
docker volume rm trading-postgres-data 2>$null

# Start PostgreSQL container
Write-Host "Starting PostgreSQL..." -ForegroundColor Green
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if PostgreSQL is ready
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    $ready = docker exec trading-postgres pg_isready -U trading_user -d trading_db 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "PostgreSQL is ready!" -ForegroundColor Green
        break
    }
    $attempt++
    Write-Host "Waiting... ($attempt/$maxAttempts)" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}

if ($attempt -eq $maxAttempts) {
    Write-Host "PostgreSQL failed to start" -ForegroundColor Red
    exit 1
}

# Display connection info
Write-Host "`nDatabase Connection Info:" -ForegroundColor Cyan
Write-Host "  Host:     localhost" -ForegroundColor White
Write-Host "  Port:     5432" -ForegroundColor White
Write-Host "  Database: trading_db" -ForegroundColor White
Write-Host "  User:     trading_user" -ForegroundColor White
Write-Host "  Password: trading_password" -ForegroundColor White

# Verify tables
Write-Host "`nVerifying tables..." -ForegroundColor Cyan
docker exec trading-postgres psql -U trading_user -d trading_db -c "\dt"

# Test connection
Write-Host "`nTesting connection..." -ForegroundColor Cyan
docker exec -e PGPASSWORD=trading_password trading-postgres psql -U trading_user -d trading_db -c "SELECT COUNT(*) FROM users;"

Write-Host "`nDatabase reset complete! You can now connect from DBeaver." -ForegroundColor Green
Write-Host "If DBeaver still fails, delete the old connection and create a new one." -ForegroundColor Yellow
