# -------------------------
# Base Stage
# -------------------------
FROM node:lts-alpine3.22 AS base
RUN apk add --no-cache ca-certificates curl openssl && update-ca-certificates
WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app && chown node:node /usr/src/app

# -------------------------
# Builder Stage
# -------------------------
FROM base AS builder


# Install dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts --prefer-offline

# Copy source code for build
COPY app.config.ts typeorm-cli.config.ts nest-cli.json tsconfig*.json ./
COPY src ./src
COPY migrations ./migrations

# Build the app
RUN npm run build

# -------------------------
# Development Stage
# -------------------------
FROM base AS dev

# Install dev dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts --prefer-offline

# Copy source code for development
COPY app.config.ts typeorm-cli.config.ts nest-cli.json tsconfig*.json .env.development ./
COPY src ./src
COPY test ./test
COPY migrations ./migrations

USER node
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# -------------------------
# Production Stage
# -------------------------
FROM base AS prod

WORKDIR /usr/src/app

# Copy only compiled output and configs securely
COPY --from=builder --chown=root:root --chmod=555 /usr/src/app/dist ./dist
COPY --from=builder --chown=root:root --chmod=444 /usr/src/app/package*.json ./
COPY --from=builder --chown=root:root --chmod=444 /usr/src/app/nest-cli.json /usr/src/app/tsconfig*.json ./

RUN npm ci --ignore-scripts --prefer-offline --only=production && \
    chmod -R a-w /usr/src/app

USER node
EXPOSE 3000
CMD ["sh", "-c", "npm run migration:run:prod && npm run start:prod"]