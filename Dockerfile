# Multi-stage Dockerfile for DevLabs Backend and Frontend

# --- Backend Build Stage ---
FROM node:20-alpine AS backend-builder

WORKDIR /usr/src/app/backend

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY backend/ ./

# --- Frontend Build Stage ---
FROM node:20-alpine AS frontend-builder
ENV VITE_API_BASE_URL=""

WORKDIR /usr/src/app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production

ENV NODE_ENV production
ENV DATABASE_URL ""

# Install serve for static file serving
RUN npm install -g serve

# Create app directory
WORKDIR /usr/src/app

# Copy backend from backend-builder
COPY --from=backend-builder /usr/src/app/backend ./backend

# Copy frontend build from frontend-builder
COPY --from=frontend-builder /usr/src/app/frontend/dist ./frontend/dist

# Expose backend port
EXPOSE 10000

# Command to run the application
CMD [ "sh", "-c", "npm start --prefix backend & serve -l 5173 frontend/dist" ]