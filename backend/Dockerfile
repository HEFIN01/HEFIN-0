# backend/Dockerfile

# Use a specific version of Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
# This allows Docker to cache the npm install step if only source code changes
COPY package*.json ./

# Install project dependencies
# Use npm ci for clean installs in CI/CD and consistent builds
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your Express app will run on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
