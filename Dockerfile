FROM node:20-slim

WORKDIR /home/node/app/sending-events-with-bulk

CMD [ "tail", "-f", "/dev/null" ]