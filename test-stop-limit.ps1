# Test Stop-Limit Orders
Write-Host "=== TESTING STOP-LIMIT ORDERS ===" -ForegroundColor Cyan

# 1. Đặt lệnh BÁN thường (Ask) giá 50000
Write-Host "`n1. Đặt lệnh BÁN (Ask) @ 50000..." -ForegroundColor Yellow
$order1 = @{
    symbol = "BTC/USDT"
    price = 50000
    amount = 1.0
    side = "Ask"
    type = "Limit"
} | ConvertTo-Json

$result1 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" -Method POST -Body $order1 -ContentType "application/json" -Headers @{ Authorization = "Bearer dummy" }
Write-Host "✅ Order placed: $($result1 | ConvertTo-Json)" -ForegroundColor Green

# 2. Đặt lệnh STOP-LOSS (Stop Sell) - Trigger @ 49000, Limit @ 48500
Write-Host "`n2. Đặt lệnh STOP-LOSS (Sell Stop) - Trigger @ 49000, Limit @ 48500..." -ForegroundColor Yellow
$order2 = @{
    symbol = "BTC/USDT"
    price = 48500
    amount = 0.5
    side = "Ask"
    type = "StopLimit"
    trigger_price = 49000
} | ConvertTo-Json

Write-Host "Sending: $order2" -ForegroundColor Gray
$result2 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" -Method POST -Body $order2 -ContentType "application/json" -Headers @{ Authorization = "Bearer dummy" }
Write-Host "✅ Stop-Loss placed: $($result2 | ConvertTo-Json)" -ForegroundColor Green

# 3. Đặt lệnh MUA (Bid) giá 49500 để TRIGGER stop-loss
Write-Host "`n3. Đặt lệnh MUA (Bid) @ 49500 để trigger Stop-Loss..." -ForegroundColor Yellow
$order3 = @{
    symbol = "BTC/USDT"
    price = 49500
    amount = 2.0
    side = "Bid"
    type = "Limit"
} | ConvertTo-Json

$result3 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" -Method POST -Body $order3 -ContentType "application/json" -Headers @{ Authorization = "Bearer dummy" }
Write-Host "✅ Buy order placed: $($result3 | ConvertTo-Json)" -ForegroundColor Green

# 4. Đặt lệnh MUA (Bid) @ 48000 để chờ Stop-Loss kích hoạt
Write-Host "`n4. Đặt lệnh MUA (Bid) @ 48000 để chờ Stop-Loss kích hoạt..." -ForegroundColor Yellow
$order4 = @{
    symbol = "BTC/USDT"
    price = 48000
    amount = 1.0
    side = "Bid"
    type = "Limit"
} | ConvertTo-Json

$result4 = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" -Method POST -Body $order4 -ContentType "application/json" -Headers @{ Authorization = "Bearer dummy" }
Write-Host "✅ Final buy order placed: $($result4 | ConvertTo-Json)" -ForegroundColor Green

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Cyan
Write-Host "Check Engine logs to see if Stop-Loss was triggered!" -ForegroundColor Magenta
