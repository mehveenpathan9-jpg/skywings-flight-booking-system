@echo off
title SkyWings Airways Server
echo ============================================================
echo Starting SkyWings Flight Booking Full-Stack Server...
echo ============================================================
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting with Node.js Backend...
    node server.js
) else (
    echo Starting with Python Server...
    python server.py
)
pause
