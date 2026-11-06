@echo off
setlocal
echo ==========================================================
echo  FUJI SMART DX - System Startup (Windows Batch)
echo  Fuji Kyuko Co., Ltd. Enterprise DX Platform
echo ==========================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1"

pause
