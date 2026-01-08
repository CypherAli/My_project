# PowerShell script to run the matching engine
Write-Host "🔥 Starting Rust Matching Engine..." -ForegroundColor Cyan

# Check if Rust is installed
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Cargo not found! Please install Rust first:" -ForegroundColor Red
    Write-Host "   winget install Rustlang.Rustup" -ForegroundColor Yellow
    exit 1
}

# Navigate to engine directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📦 Building and running..." -ForegroundColor Green
cargo run

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Engine stopped successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Engine exited with error code $LASTEXITCODE" -ForegroundColor Red
}
