FROM node:12

COPY . /var/www/html

WORKDIR /var/www/html

CMD nodejs server.js

EXPOSE 3000
