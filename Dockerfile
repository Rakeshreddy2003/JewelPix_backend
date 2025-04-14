# Use official Node.js as base
FROM node:18

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set working directory
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Create a Python virtual environment
RUN python3 -m venv /venv

# Upgrade pip inside the virtual environment
RUN /venv/bin/pip install --upgrade pip

# Install required Python dependencies in the virtual environment
RUN /venv/bin/pip install tensorflow numpy scikit-learn pymongo python-dotenv

# Copy entire backend code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]