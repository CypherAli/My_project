# Test Redis Integration with Matching Engine
Write-Host "Testing Redis Integration..." -ForegroundColor Cyan

# 1. Send BID order
Write-Host "Sending BID order..." -ForegroundColor Yellow
$bidOrder = '{"type":"Place","order":{"id":1001,"user_id":100,"symbol":"BTC/USDT","price":"50000.00","amount":"1.5","side":"Bid"}}'
docker exec trading-nats nats pub orders $bidOrder

Start-Sleep -Seconds 1

# 2. Send ASK order
Write-Host "Sending ASK order..." -ForegroundColor Yellow
$askOrder = '{"type":"Place","order":{"id":1002,"user_id":101,"symbol":"BTC/USDT","price":"50001.00","amount":"2.0","side":"Ask"}}'
docker exec trading-nats nats pub orders $askOrder

Start-Sleep -Seconds 1

# 3. Check Redis
Write-Host "Checking Redis..." -ForegroundColor Cyan
$snapshot = docker exec trading-redis redis-cli GET "orderbook:BTC/USDT"

if ($snapshot) {
    Write-Host "SUCCESS: Snapshot found in Redis!" -ForegroundColor Green
    Write-Host "Orderbook Snapshot:" -ForegroundColor White
    Write-Host $snapshot
} else {
    Write-Host "ERROR: No snapshot found" -ForegroundColor Red
}

Write-Host "Test completed!" -ForegroundColor Cyan
