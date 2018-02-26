FROM node:5.1.0

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3330
EXPOSE 45668

ENV DOCKER true

CMD [ "npm", "start" ]
