FROM node:17-alpine3.12

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
