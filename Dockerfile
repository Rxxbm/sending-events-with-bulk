FROM node:20-slim

WORKDIR /home/node/app/sending-events-with-bulk

COPY ./sending-events-with-bulk/package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev" ]