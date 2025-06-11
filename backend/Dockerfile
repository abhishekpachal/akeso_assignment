# backend/Dockerfile
FROM node:18-slim

# Create app directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Copy environment variables (ensure .env exists)
COPY .env .env

# Expose backend port
EXPOSE 5000

# Start the Node.js server
CMD sh -c "npx drizzle-kit generate && npx drizzle-kit migrate && node server.js"
