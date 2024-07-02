FROM node:20.11.1-bookworm

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

RUN rm -rf dist

RUN chmod +x src/utils/bash/copy-js-files.js

# RUN mkdir dist && cp -R src/**/*.js dist/

CMD ["npm", "run", "dev"]

