FROM node:16-alpine as development

WORKDIR /app

COPY tsconfig*.json ./
COPY package*.json ./
COPY .env ./
COPY client ./client

RUN npm ci

COPY src/ src/

RUN npm run build

FROM node:16-alpine as production

WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY client ./client

RUN npm ci --omit=dev

COPY --from=development /app/dist/ ./dist/

EXPOSE 8080

CMD [ "node", "dist/main.js" ]
