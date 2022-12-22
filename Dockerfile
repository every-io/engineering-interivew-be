# base for dev and prod images
FROM node:18.10.0-alpine3.16 as base

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN npm ci
RUN rm .npmrc

COPY . .

# prod dependencies
FROM base as prod_deps

ARG NPM_TOKEN
RUN npm prune --omit=dev

# prod image
FROM node:18.10.0-alpine3.16

WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=prod_deps /app/node_modules ./node_modules

CMD node ./dist/main.js