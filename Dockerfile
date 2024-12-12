FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./startup.dev.sh

CMD ["./startup.dev.sh"]