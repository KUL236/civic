@echo off
REM Quick Start Script for CivicSense
REM Run this from the project root directory

echo.
echo ============================================
echo  CivicSense - Quick Start Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please download and install from: https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js found: %node --version%
echo.

REM Install backend dependencies
echo [STEP 1] Installing backend dependencies...
cd backend
if exist package.json (
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
    echo [✓] Backend dependencies installed
) else (
    echo [ERROR] package.json not found in backend/
    pause
    exit /b 1
)

echo.
echo [STEP 2] Checking for .env file...
if not exist .env (
    echo [WARNING] .env file not found
    echo Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo [✓] .env created - please edit with your MongoDB URI
    ) else (
        echo [ERROR] .env.example not found
    )
) else (
    echo [✓] .env file exists
)

echo.
echo ============================================
echo  Setup Complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Configure MongoDB:
echo    - Edit backend\.env
echo    - Set MONGO_URI (local or MongoDB Atlas)
echo.
echo 2. Add Firebase credentials:
echo    - Place serviceAccountKey.json in backend/
echo    - Get from https://console.firebase.google.com/
echo.
echo 3. Start Backend:
echo    cd backend
echo    npm start
echo.
echo 4. Start Frontend (in new terminal):
echo    cd frontend
echo    python -m http.server 8000
echo    (or use: npx http-server -p 8000)
echo.
echo 5. Open in browser:
echo    http://localhost:8000
echo.
pause
