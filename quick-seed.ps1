# Quick Seed - Register new user then seed orderbook
Write-Host "Quick Seed Script" -ForegroundColor Cyan

$API = "http://localhost:8080/api/v1"
$username = "demo$(Get-Random -Minimum 100 -Maximum 999)"

# 1. Register
Write-Host "`n[1] Registering user: $username..." -ForegroundColor Yellow
$regBody = @{ username = $username; email = "$username@test.com"; password = "Pass1234" } | ConvertTo-Json
$regRes = Invoke-RestMethod -Uri "$API/auth/register" -Method POST -Body $regBody -ContentType "application/json"
Write-Host "OK - User ID: $($regRes.user.id)" -ForegroundColor Green

# 2. Login
Write-Host "`n[2] Logging in..." -ForegroundColor Yellow
$loginBody = @{ username = $username; password = "Pass1234" } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$API/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginRes.token
Write-Host "OK - Token obtained" -ForegroundColor Green

$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

# 3. Deposit
Write-Host "`n[3] Depositing..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$API/accounts/deposit" -Method POST -Headers $headers -Body (@{currency="BTC"; amount="10"} | ConvertTo-Json) | Out-Null
Invoke-RestMethod -Uri "$API/accounts/deposit" -Method POST -Headers $headers -Body (@{currency="USDT"; amount="1000000"} | ConvertTo-Json) | Out-Null
Write-Host "OK - Funded" -ForegroundColor Green

# 4. Place orders
Write-Host "`n[4] Creating orders..." -ForegroundColor Yellow
$prices = @(99000, 98500, 98000, 100000, 100500, 101000)
$sides = @("buy", "buy", "buy", "sell", "sell", "sell")

for ($i = 0; $i -lt 6; $i++) {
    $body = @{ symbol = "BTC/USDT"; type = "limit"; side = $sides[$i]; price = $prices[$i]; amount = 0.5 } | ConvertTo-Json
    Invoke-RestMethod -Uri "$API/orders" -Method POST -Headers $headers -Body $body | Out-Null
    Write-Host "  + $($sides[$i]) @ $($prices[$i])" -ForegroundColor Gray
}

Write-Host "`nDONE! Check http://localhost:3000" -ForegroundColor Green
Write-Host "Login: $username / Pass1234" -ForegroundColor Cyan
