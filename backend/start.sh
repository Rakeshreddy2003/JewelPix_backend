#!/bin/bash

# Install Python dependencies
pip install -r model_training/requirements.txt

# Install Node.js dependencies
npm install

# Start the backend server
node server.js
