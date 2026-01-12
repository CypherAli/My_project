# Demo Market Order - Quick Test Script
# Chạy script này sau khi đã start Rust Engine và Go Gateway

Write-Host "🧪 Market Order Demo Test Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_URL = "http://localhost:8080"
$TOKEN = "your_jwt_token_here" # Thay bằng token thật từ login

# Function to send API request
function Send-Order {
    param(
        [string]$Type,
        [string]$Side,
        [decimal]$Price,
        [decimal]$Amount
    )
    
    $body = @{
        symbol = "BTC/USDT"
        type = $Type
        side = $Side
        price = $Price
        amount = $Amount
    } | ConvertTo-Json
    
    Write-Host "📤 Sending $Type $Side order: $Amount BTC @ $Price USDT" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/api/v1/orders" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $TOKEN"
                "Content-Type" = "application/json"
            } `
            -Body $body
        
        Write-Host "✅ Order placed: ID = $($response.order_id)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "Step 1: Tạo thanh khoản giả (Limit Sell Orders)" -ForegroundColor Magenta
Write-Host "------------------------------------------------" -ForegroundColor Magenta

# Tạo 3 lệnh bán giá khác nhau
Send-Order -Type "Limit" -Side "Sell" -Price 50000 -Amount 1.0
Start-Sleep -Seconds 1

Send-Order -Type "Limit" -Side "Sell" -Price 50100 -Amount 0.5
Start-Sleep -Seconds 1

Send-Order -Type "Limit" -Side "Sell" -Price 50200 -Amount 0.3
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "Step 2: Đặt Market Buy Order (sẽ khớp ngay)" -ForegroundColor Magenta
Write-Host "--------------------------------------------" -ForegroundColor Magenta

# Market Order: Mua 1.2 BTC ở giá thị trường
# Sẽ khớp: 1.0 @ 50,000 + 0.2 @ 50,100
Send-Order -Type "Market" -Side "Buy" -Price 0 -Amount 1.2

Write-Host ""
Write-Host "Step 3: Kiểm tra OrderBook" -ForegroundColor Magenta
Write-Host "---------------------------" -ForegroundColor Magenta

try {
    $orderbook = Invoke-RestMethod -Uri "$API_URL/api/v1/orderbook/BTC/USDT" -Method GET
    
    Write-Host ""
    Write-Host "📊 OrderBook Hiện Tại:" -ForegroundColor Cyan
    Write-Host "Asks (Bán):" -ForegroundColor Yellow
    foreach ($ask in $orderbook.asks) {
        Write-Host "  Price: $($ask.price) USDT, Amount: $($ask.amount) BTC"
    }
    
    Write-Host ""
    Write-Host "Bids (Mua):" -ForegroundColor Green
    foreach ($bid in $orderbook.bids) {
        Write-Host "  Price: $($bid.price) USDT, Amount: $($bid.amount) BTC"
    }
}
catch {
    Write-Host "❌ Cannot fetch orderbook: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Demo Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Notes:" -ForegroundColor Cyan
Write-Host "  - Bạn cần thay TOKEN ở đầu script bằng JWT token thật" -ForegroundColor Gray
Write-Host "  - Đảm bảo Rust Engine và Go Gateway đang chạy" -ForegroundColor Gray
Write-Host "  - Kiểm tra logs của Engine để thấy trade matching" -ForegroundColor Gray
