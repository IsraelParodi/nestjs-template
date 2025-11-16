# ===== BASE =====
FROM node:lts-alpine3.22 AS base
WORKDIR /app

# Install dependencies layer
COPY package*.json ./
RUN npm ci

# ===== DEV STAGE =====
FROM base AS dev
WORKDIR /app

# Copy full source for dev
COPY . .

# Dev: hot reload, no migrations here
CMD ["npm", "run", "start:dev"]

# ===== BUILD STAGE =====
FROM base AS builder
WORKDIR /app

# Copy source and build
COPY . .
RUN npm run build

# ===== PROD RUNTIME STAGE =====
FROM node:lts-alpine3.22 AS prod
WORKDIR /app
ENV NODE_ENV=production

# Install only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built dist from builder
COPY --from=builder /app/dist ./dist

# If you need other runtime files (like .env.example, ormconfig, etc), copy them here
# COPY ormconfig.js ./ormconfig.js

# Default: run migrations then start app (can be overridden by docker-compose)
CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]
