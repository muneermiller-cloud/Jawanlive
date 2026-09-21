@echo off
title Live Sports Streaming Player
echo =======================================================
echo   Starting Live Sports Streaming Player on Your PC...
echo =======================================================

if not exist node_modules (
    echo Installing dependencies, please wait...
    call npm install
)

echo.
echo Launching server...
echo.
call npm run dev
pause
