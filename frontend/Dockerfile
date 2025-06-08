# frontend/Dockerfile (production)
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Copy production env file
COPY .env.production .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
