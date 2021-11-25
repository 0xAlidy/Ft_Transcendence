FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli 

EXPOSE 667 9229

ENTRYPOINT npm install && npm run build && npm run start:dev