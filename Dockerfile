# ===== BASE =====
FROM node:lts-alpine3.22 AS base
WORKDIR /usr/src/app

# Install dependencies layer
COPY package*.json ./
RUN npm ci --ignore-scripts


# ===== DEV STAGE =====
FROM base AS dev
WORKDIR /usr/src/app

# Copy only what is needed for development inside the container
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY package*.json ./
COPY src ./src
COPY test ./test

# non-root user (built-in in node image)
USER node

# Dev: hot reload, no migrations here
CMD ["npm", "run", "start:dev"]


# ===== BUILD STAGE =====
FROM base AS builder
WORKDIR /usr/src/app

COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY package*.json ./
COPY src ./src

# Make sure node user owns the sources (optional but nice)
RUN chown -R node:node /usr/src/app
USER node

RUN npm run build


# ===== PROD RUNTIME STAGE =====
FROM node:lts-alpine3.22 AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install only prod deps
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev && npm cache clean --force

# Copy built dist from builder
COPY --from=builder /usr/src/app/dist ./dist

# Run as non-root
USER node

# Default: run migrations then start app (can be overridden by docker-compose)
CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]
