#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Move into the project directory if needed (optional)
cd /home/site/wwwroot

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r model_training/requirements.txt

# Install Node.js dependencies
npm install

# Start the Node.js server
exec node server.js
