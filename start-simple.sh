#!/bin/bash

# Quick Start Script for CRED Simple App
# This script starts both the backend and frontend

echo "🚀 Starting CRED - Simple Wallet Analysis App"
echo ""
echo "📋 This will start:"
echo "   1. vlayer Backend Proxy (port 3001)"
echo "   2. Expo Web Frontend (port 8081)"
echo ""
echo "📌 Make sure you have:"
echo "   ✓ Node.js installed"
echo "   ✓ MetaMask extension installed in your browser"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🔧 Starting servers..."
echo ""

# Start both servers
npm run dev:simple
