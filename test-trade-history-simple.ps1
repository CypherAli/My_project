# Quick Test - Trade History Module
Write-Host ""
Write-Host "=== TRADE HISTORY MODULE - QUICK CHECK ===" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "[1/5] Checking Backend..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 3 -UseBasicParsing
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "      Start backend: cd services\gateway; go run cmd\server\main.go" -ForegroundColor Yellow
}

# Check Frontend
Write-Host "[2/5] Checking Frontend..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "      Start frontend: cd web; npm run dev" -ForegroundColor Yellow
}

# Check Files
Write-Host "[3/5] Checking trade.go..." -NoNewline
if (Test-Path "services\gateway\internal\api\handlers\trade.go") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Red
}

Write-Host "[4/5] Checking TradeHistory.tsx..." -NoNewline
if (Test-Path "web\src\components\TradeHistory.tsx") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Red
}

Write-Host "[5/5] Checking SQL query..." -NoNewline
$dbContent = Get-Content "services\gateway\internal\database\sqlc\db.go" -Raw
if ($dbContent -match "ListUserTrades") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== MANUAL TEST STEPS ===" -ForegroundColor Yellow
Write-Host "1. Open: http://localhost:3000" -ForegroundColor Cyan
Write-Host "2. Login to app" -ForegroundColor Gray
Write-Host "3. Tab 'Funds' -> Deposit 100,000 USDT" -ForegroundColor Gray
Write-Host "4. Tab 'Market' -> Buy 1.0 BTC" -ForegroundColor Gray
Write-Host "5. Click tab 'History' (bottom panel)" -ForegroundColor Gray
Write-Host "6. Expect: See trade appear!" -ForegroundColor Green
Write-Host ""
Write-Host "Auto-refresh: 5 seconds" -ForegroundColor Gray
Write-Host "Documentation: TRADE_HISTORY_COMPLETE.md" -ForegroundColor Gray
Write-Host ""
