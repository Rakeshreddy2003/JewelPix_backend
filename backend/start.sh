#!/bin/bash

# Install ML dependencies
pip install --upgrade pip
pip install -r model_training/requirements.txt

# Start Node server
node server.js
