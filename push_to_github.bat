@echo off
title Push to GitHub
cd /d "%~dp0"
echo ===================================================
echo   Pushing Equviscale updates to GitHub...
echo   Repository: https://github.com/Shreyans236/Equviscale
echo   Username:   charantelugu3-bit
echo   Email:      charantelugu3@gmail.com
echo ===================================================

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\mingw64\bin;%PATH%"

git config user.name "charantelugu3-bit"
git config user.email "charantelugu3@gmail.com"

echo.
echo [1/3] Staging changes...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "Update Equviscale features, portal fixes, and local run scripts"

echo.
echo [3/3] Pushing to origin main...
git push origin main

echo.
echo ===================================================
echo   Push process complete.
echo ===================================================
pause
