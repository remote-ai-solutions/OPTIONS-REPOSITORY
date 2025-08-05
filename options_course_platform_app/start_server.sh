#!/bin/bash

echo "Starting Options Course Platform Server..."
echo "Please wait while we install dependencies and start the server..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! Starting server..."
    
    # Install serve if not already installed
    npm install serve
    
    # Start the server on port 3000, accessible from all interfaces
    echo "Server starting on http://0.0.0.0:3000"
    echo "External access: http://34.234.129.134:3000"
    echo "Press Ctrl+C to stop the server"
    
    npx serve -s build -l tcp://0.0.0.0:3000
else
    echo "Build failed! Please check the error messages above."
    exit 1
fi 