FROM node:8.10.0

RUN apt upgrade -y

RUN apt-get update -y

WORKDIR /app

COPY . .

EXPOSE 8082

CMD [ "node", "server.js" ]
