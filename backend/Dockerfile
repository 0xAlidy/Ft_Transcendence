FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@latest @nestjs/cli

EXPOSE 667 9229

ENTRYPOINT npm install && npm run start:dev
