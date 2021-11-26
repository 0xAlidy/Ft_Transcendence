FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@latest

EXPOSE 3000

ENTRYPOINT npm install && npm start
