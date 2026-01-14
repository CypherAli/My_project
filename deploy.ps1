# Deploy Production - One Command to Rule Them All
Write-Host "=== APEX EXCHANGE - PRODUCTION DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Stopping old containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

Write-Host ""
Write-Host "[2/3] Building images (this may take 2-5 minutes)..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml build

Write-Host ""
Write-Host "[3/3] Starting all services..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

Write-Host ""
Write-Host "=== DEPLOYMENT COMPLETE ===" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  API:       http://localhost:8080" -ForegroundColor White
Write-Host "  NATS:      http://localhost:8222" -ForegroundColor White
Write-Host ""
Write-Host "Check logs:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Gray
Write-Host ""
Write-Host "Stop all:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose.prod.yml down" -ForegroundColor Gray
