# ==============================================================================
# FUJI SMART DX - PowerShell Localhost Shutdown Script
# Fuji Kyuko Co., Ltd. - Enterprise DX Platform
# ==============================================================================

Write-Host "Stopping FUJI SMART DX background processes..." -ForegroundColor Yellow

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Stop Backend
if (Test-Path "$CurrentDir\.backend.pid") {
    $BackendPid = Get-Content "$CurrentDir\.backend.pid"
    try {
        Stop-Process -Id $BackendPid -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped Backend process (PID $BackendPid)" -ForegroundColor Green
    } catch {}
    Remove-Item "$CurrentDir\.backend.pid" -Force -ErrorAction SilentlyContinue
}

# Stop Frontend
if (Test-Path "$CurrentDir\.frontend.pid") {
    $FrontendPid = Get-Content "$CurrentDir\.frontend.pid"
    try {
        Stop-Process -Id $FrontendPid -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped Frontend process (PID $FrontendPid)" -ForegroundColor Green
    } catch {}
    Remove-Item "$CurrentDir\.frontend.pid" -Force -ErrorAction SilentlyContinue
}

# Also cleanup any stray process on 8000 or 5173
$ports = @(8000, 5173)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            try {
                Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
                Write-Host "Freed port $port (PID $($conn.OwningProcess))" -ForegroundColor Green
            } catch {}
        }
    }
}

Write-Host "All FUJI SMART DX processes stopped successfully." -ForegroundColor Cyan
