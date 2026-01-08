@echo off
echo Starting Rust Matching Engine...

REM Check if cargo is available
where cargo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Cargo not found! Please install Rust first.
    echo https://rustup.rs/
    exit /b 1
)

REM Navigate to engine directory
cd /d "%~dp0"

REM Run the engine
cargo run

if %ERRORLEVEL% EQU 0 (
    echo Engine stopped successfully
) else (
    echo Engine exited with error
)
pause
