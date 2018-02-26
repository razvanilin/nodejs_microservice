FROM node:7.2

# Create app directory
WORKDIR /usr/src/client

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
EXPOSE 35729

CMD [ "npm", "start" ]
