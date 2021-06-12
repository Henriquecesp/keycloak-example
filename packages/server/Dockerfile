FROM node:16.2.0-alpine

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN yarn

COPY . .

EXPOSE 3000

CMD echo foi && yarn start