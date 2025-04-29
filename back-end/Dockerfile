# Dockerfile for HydroForest Back-end

FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Expose your back-end port
ENV PORT=5005
EXPOSE 5005

# Start the server
CMD ["node", "app.js"]
