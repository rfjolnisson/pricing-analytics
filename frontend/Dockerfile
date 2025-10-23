FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source and config
COPY . .

# Expose port
EXPOSE 5175

# Start dev server
CMD ["npm", "run", "dev", "--", "--host"]

