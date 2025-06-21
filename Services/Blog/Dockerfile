# --- Stage 1: Builder ---
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (cached if package*.json hasn't changed)
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Copy source files after installing dependencies
COPY ./src ./src

# Build TypeScript project
RUN npm run build


# --- Stage 2: Production ---
FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built code from builder stage
COPY --from=builder /app/dist ./dist

# Set NODE_ENV to production
ENV NODE_ENV=production

# # Expose the port your app listens on (if applicable, e.g., 3000)
# EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]
