FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

EXPOSE 3000

ENTRYPOINT npm install && npm start

