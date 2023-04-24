# build stage
FROM node:14-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --only=production

# main stage
FROM gcr.io/distroless/nodejs14-debian11 AS main

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules/ /usr/src/app/node_modules/ 
COPY --from=build /usr/src/app/dist/  /usr/src/app/.env /usr/src/app/

EXPOSE 4000

CMD ["main.js"]