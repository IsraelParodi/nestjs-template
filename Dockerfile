# Base stage
FROM node:lts-alpine3.22 AS base
WORKDIR /usr/src/app

# Fix ownership of base folder only
RUN mkdir -p /usr/src/app && chown node:node /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci --ignore-scripts --prefer-offline

# Dev stage
FROM base AS dev

ENV NODE_ENV=development

COPY --chown=node:node app.config.ts typeorm-cli.config.ts nest-cli.json tsconfig*.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node test ./test
COPY --chown=node:node migrations ./migrations 

USER node
CMD ["npm", "run", "start:dev"]

# Prod stage
FROM base AS prod
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --chown=node:node app.config.ts typeorm-cli.config.ts nest-cli.json tsconfig*.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node migrations ./migrations 

RUN npm run build && npm prune --production

USER node
EXPOSE 3000
CMD ["sh", "-c", "npm run migration:run:prod && npm run start:prod"]