# Quick Start All Services for Trade History Testing
Write-Host ""
Write-Host "=== STARTING ALL SERVICES ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will open 3 terminals:" -ForegroundColor Yellow
Write-Host "  - Terminal 1: Rust Engine" -ForegroundColor Gray
Write-Host "  - Terminal 2: Go Gateway" -ForegroundColor Gray
Write-Host "  - Terminal 3: Frontend" -ForegroundColor Gray
Write-Host ""

# Terminal 1: Rust Engine
Write-Host "[1/3] Starting Rust Engine..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd e:\My_Project\services\engine; Write-Host 'Starting Rust Engine...' -ForegroundColor Green; cargo run --bin matching-engine"

Start-Sleep -Seconds 2

# Terminal 2: Go Gateway
Write-Host "[2/3] Starting Go Gateway..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd e:\My_Project\services\gateway; Write-Host 'Starting Go Gateway...' -ForegroundColor Green; go run cmd\server\main.go"

Start-Sleep -Seconds 3

# Terminal 3: Frontend
Write-Host "[3/3] Starting Frontend..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd e:\My_Project\web; Write-Host 'Starting Frontend...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "All services are starting..." -ForegroundColor Yellow
Write-Host "Wait 10-15 seconds, then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
