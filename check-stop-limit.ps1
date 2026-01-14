# Quick Demo: Stop-Limit Orders Working
Write-Host "=== DEMO STOP-LIMIT ORDERS ===" -ForegroundColor Cyan
Write-Host ""

# Check if all services are running
Write-Host "1. Checking services..." -ForegroundColor Yellow
$nats = Test-NetConnection -ComputerName localhost -Port 4222 -WarningAction SilentlyContinue
$postgres = Test-NetConnection -ComputerName localhost -Port 5433 -WarningAction SilentlyContinue
$redis = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
$gateway = Test-NetConnection -ComputerName localhost -Port 8080 -WarningAction SilentlyContinue
$web = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue

if ($nats.TcpTestSucceeded) { Write-Host "   ✅ NATS running" -ForegroundColor Green } else { Write-Host "   ❌ NATS not running" -ForegroundColor Red }
if ($postgres.TcpTestSucceeded) { Write-Host "   ✅ PostgreSQL running" -ForegroundColor Green } else { Write-Host "   ❌ PostgreSQL not running" -ForegroundColor Red }
if ($redis.TcpTestSucceeded) { Write-Host "   ✅ Redis running" -ForegroundColor Green } else { Write-Host "   ❌ Redis not running" -ForegroundColor Red }
if ($gateway.TcpTestSucceeded) { Write-Host "   ✅ Gateway API running" -ForegroundColor Green } else { Write-Host "   ❌ Gateway not running" -ForegroundColor Red }
if ($web.TcpTestSucceeded) { Write-Host "   ✅ Web UI running" -ForegroundColor Green } else { Write-Host "   ❌ Web not running" -ForegroundColor Red }

Write-Host ""
Write-Host "2. Checking database schema..." -ForegroundColor Yellow
$result = docker exec -e PGPASSWORD=trading_password trading-postgres psql -U trading_user -d trading_db -c "\d engine_orders" 2>&1
if ($result -match "trigger_price" -and $result -match "type") {
    Write-Host "   ✅ Database schema updated with trigger_price and type columns" -ForegroundColor Green
} else {
    Write-Host "   ❌ Database schema missing new columns" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== SYSTEM STATUS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Web UI:           http://localhost:3000" -ForegroundColor White
Write-Host "🔌 Gateway API:      http://localhost:8080" -ForegroundColor White
Write-Host "🦀 Rust Engine:      Listening on NATS" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host "   2. Register/Login" -ForegroundColor White
Write-Host "   3. Click SELL tab" -ForegroundColor White
Write-Host "   4. Select 🛡️ Stop-Limit" -ForegroundColor White
Write-Host "   5. Fill in:" -ForegroundColor White
Write-Host "      - Trigger Price: 49000" -ForegroundColor Cyan
Write-Host "      - Limit Price: 48500" -ForegroundColor Cyan
Write-Host "      - Amount: 0.5" -ForegroundColor Cyan
Write-Host "   6. Click 'Sell BTC'" -ForegroundColor White
Write-Host ""
Write-Host "💡 The Stop-Loss order will wait hidden until market price hits 49000," -ForegroundColor Gray
Write-Host "   then automatically place a sell order at 48500 (protecting you from losses)!" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Full guide: .\STOP_LIMIT_TEST_GUIDE.md" -ForegroundColor Magenta
Write-Host ""
