#!/bin/bash

# Stop any running processes on port 3334
port=3334
pid=$(lsof -t -i:$port)
if [ ! -z "$pid" ]; then
    echo "Killing process on port $port"
    kill -9 $pid
fi

# Clear node_modules and reinstall dependencies
echo "Clearing node_modules..."
rm -rf node_modules
rm -rf src/client/node_modules
rm -rf src/client/build

# Install dependencies
echo "Installing server dependencies..."
npm install

# Install and build client
echo "Installing and building client..."
cd src/client
npm install
npm run build
cd ../..

# Start the server
echo "Starting server..."
npm run dev
