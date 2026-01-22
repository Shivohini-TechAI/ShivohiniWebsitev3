# Use official Node.js Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm ci if lockfile is reliable, else npm install)
RUN npm install

# Copy source code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Expose port (default 5000)
EXPOSE 5000

# Start command
CMD ["npm", "start"]
