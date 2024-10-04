FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the application (if using TypeScript)
RUN npm run build

# Expose the gRPC server port
EXPOSE 7000

# Command to run your gRPC server
CMD ["node", "dist/main.js"]