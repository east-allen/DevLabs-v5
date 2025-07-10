# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app/backend

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install dependencies
# Using --omit=dev to not install development dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# The application binds to a port specified by the PORT environment variable,
# defaulting to 8000 if not set (as per backend/bin/www).
# Expose this port. Render will set the PORT env variable.
EXPOSE 8000

# Define the command to run the application
CMD [ "npm", "start" ]