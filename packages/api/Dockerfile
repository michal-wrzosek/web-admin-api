FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --quiet

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
