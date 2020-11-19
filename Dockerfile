#
# Nest
FROM node:15-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

RUN npm run build

#
# Nuxt.js
FROM node:15-alpine

ARG WEBSOCKET_SERVEUR_ENDPOINT

WORKDIR /app

COPY client/package*.json /app/

RUN npm install

COPY client/. .

RUN npm run build

###
###
###
FROM node:15-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install --production

COPY --from=0 /app/dist /app/dist/
COPY --from=1 /app/dist /app/client/dist/

EXPOSE 9000

CMD node dist/main
