# frontend/Dockerfile
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci

# Copy app source code (after installing dependencies)
COPY . .

# Ensure environment file is available
COPY .env.production .env

# Build Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
