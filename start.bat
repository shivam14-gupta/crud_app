@echo off
echo Starting MERN Management System...
echo.

echo 1. Starting Backend Server (port 5000)
start "MERN Backend" cmd /c "cd /d %~dp0server && node server.js"

echo 2. Starting Frontend Dev Server (port 5173)
start "MERN Frontend" cmd /c "cd /d %~dp0client && npx vite --host"

echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Demo Credentials:
echo   Admin: admin@example.com / admin123
echo   User:  john@example.com / user123
