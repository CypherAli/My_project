# Seed Orderbook - Tạo dữ liệu mẫu để test UI
Write-Host "🌱 Seeding Orderbook..." -ForegroundColor Cyan

$API_URL = "http://localhost:8080/api/v1"

# Step 1: Register & Login user
Write-Host "`n[1/4] Creating test user..." -ForegroundColor Yellow
$registerBody = @{
    username = "seeduser"
    email = "seed@test.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "User created" -ForegroundColor Green
} catch {
    Write-Host "User exists, skipping..." -ForegroundColor Yellow
}

# Login
Write-Host "`n[2/4] Logging in..." -ForegroundColor Yellow
$loginBody = @{
    username = "seeduser"
    password = "Test123456"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$TOKEN = $loginResponse.token
Write-Host "✅ Logged in. Token: $($TOKEN.Substring(0,20))..." -ForegroundColor Green

# Step 2: Deposit funds
Write-Host "`n[3/4] Depositing funds..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

$depositBTC = @{
    currency = "BTC"
    amount = "10.0"
} | ConvertTo-Json

$depositUSDT = @{
    currency = "USDT"
    amount = "1000000.0"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/accounts/deposit" -Method POST -Headers $headers -Body $depositBTC | Out-Null
Invoke-RestMethod -Uri "$API_URL/accounts/deposit" -Method POST -Headers $headers -Body $depositUSDT | Out-Null
Write-Host "✅ Deposited 10 BTC and 1M USDT" -ForegroundColor Green

# Step 3: Place multiple limit orders to populate orderbook
Write-Host "`n[4/4] Creating limit orders..." -ForegroundColor Yellow

$orders = @(
    # Buy orders (Bids)
    @{ side = "buy"; price = 99000; amount = 0.5 }
    @{ side = "buy"; price = 98500; amount = 0.8 }
    @{ side = "buy"; price = 98000; amount = 1.2 }
    @{ side = "buy"; price = 97500; amount = 0.6 }
    @{ side = "buy"; price = 97000; amount = 0.9 }
    
    # Sell orders (Asks)
    @{ side = "sell"; price = 100000; amount = 0.7 }
    @{ side = "sell"; price = 100500; amount = 0.9 }
    @{ side = "sell"; price = 101000; amount = 1.1 }
    @{ side = "sell"; price = 101500; amount = 0.8 }
    @{ side = "sell"; price = 102000; amount = 1.0 }
)

foreach ($order in $orders) {
    $orderBody = @{
        symbol = "BTC/USDT"
        type = "limit"
        side = $order.side
        price = $order.price
        amount = $order.amount
    } | ConvertTo-Json
    
    try {
        $result = Invoke-RestMethod -Uri "$API_URL/orders" -Method POST -Headers $headers -Body $orderBody
        Write-Host "  + $($order.side.ToUpper()) $($order.amount) BTC @ $($order.price)" -ForegroundColor Gray
    } catch {
        Write-Host "  - Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host "`nOrderbook seeded successfully!" -ForegroundColor Green
Write-Host "Check UI at http://localhost:3000" -ForegroundColor Cyan
