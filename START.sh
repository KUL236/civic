#!/bin/bash

# Quick Start Script for CivicSense
# Run this from the project root directory

echo ""
echo "============================================"
echo "  CivicSense - Quick Start Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please download and install from: https://nodejs.org/"
    exit 1
fi

echo "[✓] Node.js found: $(node --version)"
echo ""

# Install backend dependencies
echo "[STEP 1] Installing backend dependencies..."
cd backend

if [ -f "package.json" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] npm install failed"
        exit 1
    fi
    echo "[✓] Backend dependencies installed"
else
    echo "[ERROR] package.json not found in backend/"
    exit 1
fi

echo ""
echo "[STEP 2] Checking for .env file..."
if [ ! -f ".env" ]; then
    echo "[WARNING] .env file not found"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "[✓] .env created from .env.example"
        echo "[!] Please edit .env with your MongoDB URI"
    fi
else
    echo "[✓] .env file exists"
fi

echo ""
echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure MongoDB:"
echo "   - Edit backend/.env"
echo "   - Set MONGO_URI (local or MongoDB Atlas)"
echo ""
echo "2. Add Firebase credentials:"
echo "   - Place serviceAccountKey.json in backend/"
echo "   - Get from https://console.firebase.google.com/"
echo ""
echo "3. Start Backend:"
echo "   cd backend && npm start"
echo ""
echo "4. Start Frontend (in new terminal):"
echo "   cd frontend && python -m http.server 8000"
echo "   (or use: npx http-server -p 8000)"
echo ""
echo "5. Open in browser:"
echo "   http://localhost:8000"
echo ""
