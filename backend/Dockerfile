FROM node:18-alpine3.14 AS development

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]

