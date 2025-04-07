#!/bin/bash

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r ../model_training/requirements.txt

# Install Node.js dependencies and run server
npm install
node server.js
