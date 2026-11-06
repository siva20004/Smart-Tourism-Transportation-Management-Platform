@echo off
setlocal
echo ==========================================================
echo  FUJI SMART DX - System Setup (Windows Batch)
echo ==========================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1"

pause
