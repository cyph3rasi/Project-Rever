#!/bin/bash

# Install main project dependencies
npm install

# Navigate to client directory and install dependencies
cd src/client
npm install

# Build the client
npm run build

# Return to project root
cd ../..