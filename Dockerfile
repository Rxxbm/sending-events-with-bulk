FROM node:20-slim

RUN apt-get update && apt-get install -y procps

WORKDIR /home/node/app/sending-events-with-bulk

COPY ./sending-events-with-bulk/package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev" ]