# Multi-stage Dockerfile for DevLabs Backend and Frontend

# --- Backend Build Stage ---
FROM node:18-alpine AS backend-builder

WORKDIR /usr/src/app/backend

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY backend/ ./

# --- Frontend Build Stage ---
FROM node:18-alpine AS frontend-builder

WORKDIR /usr/src/app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

RUN npm run build

# --- Production Stage ---
FROM node:18-alpine AS production

# Install serve for static file serving
RUN npm install -g serve

# Create app directory
WORKDIR /usr/src/app

# Copy backend from backend-builder
COPY --from=backend-builder /usr/src/app/backend ./backend

# Copy frontend build from frontend-builder
COPY --from=frontend-builder /usr/src/app/frontend/dist ./frontend/dist

# Expose backend port
EXPOSE 8000

# Command to run the application
CMD [ "sh", "-c", "npm start --prefix backend & serve -s frontend/dist -l 5173" ]