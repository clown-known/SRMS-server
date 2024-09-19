# Use the official Node.js image as a base
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

RUN npm install -g @nestjs/cli


# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller image for the production environment
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/proto ./src/proto 
COPY --from=builder /app/src/proto/permission.proto ./src/proto/ 

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/main"]