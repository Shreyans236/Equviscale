@echo off
title EquiScale Dev Server
cd /d "%~dp0"
echo ===================================================
echo   Starting EquiScale Application...
echo   Open: http://localhost:3000 or http://127.0.0.1:3000
echo ===================================================
call npm run dev
pause
