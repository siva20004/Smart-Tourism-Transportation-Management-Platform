# ==============================================================================
# FUJI SMART DX - Setup Script (Windows PowerShell)
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " FUJI SMART DX - System Environment Setup" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Python
Write-Host "[1/6] Checking Python installation..." -ForegroundColor Yellow
$py = Get-Command python -ErrorAction SilentlyContinue
if (-not $py) {
    Write-Host "ERROR: Python is not installed or not in PATH." -ForegroundColor Red
    exit 1
}
Write-Host "Found Python: $($py.Source)" -ForegroundColor Green

# 2. Check Node.js
Write-Host "[2/6] Checking Node.js installation..." -ForegroundColor Yellow
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "ERROR: Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}
Write-Host "Found Node.js: $($node.Source)" -ForegroundColor Green

# 3. Check PostgreSQL
Write-Host "[3/6] Checking PostgreSQL service..." -ForegroundColor Yellow
$pg = Get-Service -Name *postgres* -ErrorAction SilentlyContinue
if ($pg) {
    Write-Host "PostgreSQL Service: $($pg.Status)" -ForegroundColor Green
} else {
    Write-Host "Notice: PostgreSQL service not detected under default name, checking port 5432..." -ForegroundColor Yellow
    $tcp = Test-NetConnection -ComputerName localhost -Port 5432
    if ($tcp.TcpTestSucceeded) {
        Write-Host "Port 5432 is open and listening." -ForegroundColor Green
    } else {
        Write-Host "Warning: PostgreSQL does not seem to be running on localhost:5432." -ForegroundColor Red
    }
}

# 4. Virtual Environment & Dependencies
Write-Host "[4/6] Setting up backend virtual environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend\venv")) {
    python -m venv backend\venv
}
& "backend\venv\Scripts\python.exe" -m pip install --upgrade pip
& "backend\venv\Scripts\python.exe" -m pip install -r backend\requirements.txt

# 5. Frontend dependencies
Write-Host "[5/6] Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    npm install
}
Set-Location ..

# 6. Database schema and seed
Write-Host "[6/6] Initializing PostgreSQL database & authentic seed records..." -ForegroundColor Yellow
$env:PYTHONPATH = (Get-Location).Path
& "backend\venv\Scripts\python.exe" -m backend.app.services.seed_data

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " SETUP COMPLETE! Run .\start.ps1 to start the platform." -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
