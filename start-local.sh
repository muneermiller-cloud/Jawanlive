#!/usr/bin/env bash
echo "======================================================="
echo "  Starting Live Sports Streaming Player on Your PC..."
echo "======================================================="

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Launching server..."
echo ""
npm run dev
