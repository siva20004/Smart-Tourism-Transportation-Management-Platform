@echo off
setlocal
echo ==========================================================
echo  FUJI SMART DX - System Shutdown (Windows Batch)
echo ==========================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"

pause
