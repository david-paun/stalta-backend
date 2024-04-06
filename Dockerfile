FROM node:20.11.1-bookworm

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

#ENTRYPOINT ["nodemon", "/usr/src/app/server.js"]

#VOLUME /usr/src/app

CMD ["npm", "run", "dev"]

# for testing purposes:
# docker build -t my_nodejs_image .
# docker run -d --name my_nodejs_container -p 3000:3000 my_nodejs_image
