FROM node:20-alpine

RUN apk update && apk add procps

WORKDIR /home/node/app/sending-events-with-bulk

COPY ./sending-events-with-bulk/package*.json ./

RUN npm install

COPY ./sending-events-with-bulk .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]