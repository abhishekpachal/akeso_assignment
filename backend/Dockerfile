# backend/Dockerfile (production)
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

COPY .env .env

EXPOSE 5000

CMD ["node", "server.js"]
