FROM node:15

WORKDIR /var/app

COPY . /var/app

RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start:local" ]
