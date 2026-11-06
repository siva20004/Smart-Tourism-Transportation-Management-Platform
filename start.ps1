# ==============================================================================
# FUJI SMART DX - PowerShell Localhost Startup Script
# Fuji Kyuko Co., Ltd. - Enterprise DX Platform
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " FUJI SMART DX - System Startup" -ForegroundColor White
Write-Host " Fuji Kyuko Co., Ltd. Enterprise DX Platform" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $CurrentDir

# 1. Start Backend FastAPI server in background
Write-Host "[1/3] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$BackendJob = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoProfile -Command `"`$env:PYTHONPATH='.'; & '$CurrentDir\backend\venv\Scripts\python.exe' -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000`"" `
    -WorkingDirectory $CurrentDir `
    -PassThru

# Save PID for stop script
$BackendJob.Id | Out-File -FilePath "$CurrentDir\.backend.pid" -Force

# 2. Start Frontend Vite server in background
Write-Host "[2/3] Starting React Frontend on http://localhost:5173..." -ForegroundColor Yellow
$FrontendJob = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoProfile -Command `"Set-Location '$CurrentDir\frontend'; node 'node_modules/vite/bin/vite.js' --host 0.0.0.0 --port 5173`"" `
    -WorkingDirectory "$CurrentDir\frontend" `
    -PassThru

# Save PID for stop script
$FrontendJob.Id | Out-File -FilePath "$CurrentDir\.frontend.pid" -Force

# 3. Wait 3 seconds and open browser
Start-Sleep -Seconds 3

Write-Host "[3/3] Opening FUJI SMART DX in your browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " FUJI SMART DX IS LIVE AND RUNNING LOCALLY!" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Frontend:         http://localhost:5173" -ForegroundColor White
Write-Host " Backend API:      http://localhost:8000" -ForegroundColor White
Write-Host " API Docs:         http://localhost:8000/docs" -ForegroundColor White
Write-Host " Health Check:     http://localhost:8000/health" -ForegroundColor White
Write-Host " Database:         localhost:5432 (fuji_smart_dx)" -ForegroundColor White
Write-Host " Admin Login:      admin@fujikyu.co.jp / FujiSmartAdmin2026!" -ForegroundColor White
Write-Host " Analyst Login:    analyst@fujikyu.co.jp / FujiSmartAnalyst2026!" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "To stop the servers, run: .\stop.ps1 or stop.bat" -ForegroundColor Cyan
