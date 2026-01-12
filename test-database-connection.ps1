#!/usr/bin/env pwsh
# Script to test database connection

Write-Host "Testing PostgreSQL connection..." -ForegroundColor Cyan

$dbHost = "localhost"
$dbPort = 5432
$database = "trading_db"
$user = "trading_user"
$password = "trading_password"

# Test 1: Check if container is running
Write-Host "`n1. Checking container status..." -ForegroundColor Yellow
$containerStatus = docker ps --filter "name=trading-postgres" --format "{{.Status}}"
if ($containerStatus -match "Up") {
    Write-Host "   OK - Container is running: $containerStatus" -ForegroundColor Green
} else {
    Write-Host "   FAIL - Container is not running!" -ForegroundColor Red
    exit 1
}

# Test 2: Check pg_isready
Write-Host "`n2. Checking PostgreSQL readiness..." -ForegroundColor Yellow
$ready = docker exec trading-postgres pg_isready -U $user -d $database 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK - $ready" -ForegroundColor Green
} else {
    Write-Host "   FAIL - PostgreSQL is not ready" -ForegroundColor Red
    exit 1
}

# Test 3: Connect with password
Write-Host "`n3. Testing authentication..." -ForegroundColor Yellow
$result = docker exec -e PGPASSWORD=$password trading-postgres psql -U $user -d $database -c "SELECT current_user, current_database();" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK - Authentication successful!" -ForegroundColor Green
    Write-Host $result
} else {
    Write-Host "   FAIL - Authentication failed!" -ForegroundColor Red
    Write-Host $result
    exit 1
}

# Test 4: List tables
Write-Host "`n4. Listing tables..." -ForegroundColor Yellow
docker exec -e PGPASSWORD=$password trading-postgres psql -U $user -d $database -c "\dt"

# Test 5: Check user permissions
Write-Host "`n5. Checking user permissions..." -ForegroundColor Yellow
docker exec -e PGPASSWORD=$password trading-postgres psql -U $user -d $database -c "\du trading_user"

# Test 6: External connection test using psql-style connection string
Write-Host "`n6. Connection string for external tools:" -ForegroundColor Yellow
Write-Host "   postgresql://${user}:${password}@${dbHost}:${dbPort}/${database}?sslmode=disable" -ForegroundColor Cyan

Write-Host "`nAll tests passed! Database is ready for connections." -ForegroundColor Green
Write-Host "`nDBeaver Configuration:" -ForegroundColor Cyan
Write-Host "   Driver:   PostgreSQL" -ForegroundColor White
Write-Host "   Host:     $dbHost" -ForegroundColor White
Write-Host "   Port:     $dbPort" -ForegroundColor White
Write-Host "   Database: $database" -ForegroundColor White
Write-Host "   User:     $user" -ForegroundColor White
Write-Host "   Password: $password" -ForegroundColor White
Write-Host "   SSL:      Disable" -ForegroundColor White
