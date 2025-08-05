#!/bin/bash

echo "Stopping Options Course Platform Server..."

# Find the process running on port 3000
PID=$(lsof -ti:3000)

if [ -n "$PID" ]; then
    echo "Found server process with PID: $PID"
    kill -9 $PID
    echo "Server stopped successfully!"
else
    echo "No server process found running on port 3000"
fi

echo "Options Course Platform Server has been stopped." 