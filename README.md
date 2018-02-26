# node_microservice

## Contents

 - [Dependencies](#dependencies)
 - [Starting up the microservice and API](#starting-up-the-microservice-and-api)
 - [Starting up the React web app](#starting-up-the-react-web-app)
 - [Running and writing tests on the microservice and API](#running-and-writing-tests-on-the-microservice-and-api)
 - [Linting Configuration](#linting-configuration)
 - [Running on Docker](#running-on-docker)
 - [API Docs](#api-docs)

## Dependencies

* NodeJs v5.1 or higher for microservice and API
* NodeJs v7.2 or higher for running the React client in dev mode
* MongoDb

## Starting up the microservice and API

Make sure the `mongod` service is up and running.

Clone the repository and navigate to the `server` folder

```
git clone https://github.com/razvanilin/nodejs_microservice
cd nodejs_microservice/server
npm install
npm start
```

The microservice will not be accessible through the API available on `localhost:3330`.

## Starting up the React web app

The React web app is built to visually interact with the API.

```
cd nodejs_microservice/client
npm install
npm start
```

The react app can be accessed on `localhost:3000`.

**The API must be running on `localhost:3330` for the web app to work**

## Running and writing tests on the microservice and API

```
cd server
npm test
```

The tests are held in the `tests` folder and new files should be name accordingly:

`<entity_name>-<entity_type>-test.js` (*e.g. company-controller.test.js*)

## Linting Configuration

[ESLint](https://eslint.org/) was used for linting. Configured using [Airbnb's guidelines for ES5](https://github.com/airbnb/javascript/tree/es5-deprecated/es5).

Some extra custom configurations on top of that:

```
{
  "rules": {
    "func-names": ["error", "never"],
    "no-trailing-spaces": [1, { "skipBlankLines": true }]
  }
}

```

Attempt to fix with `npm run lint`

## Running on Docker

```
docker-compose build
docker-compose up
```

The web app will be accessible on `localhost:3000`. On an older Windows machine I ran into some issues mapping the API on `localhost`. If the app can't be reached follow the steps below:

```
docker-machine ip
# copy the ip address

vim client/src/settings.js
# change 'localhost' with the ip from above

docker-compose build
docker-compose up
# now access the web app on http://<ip_address>:3000
```

The API will be accessible on `localhost:3330`, or `http://<ip_address>:3330` (See above)

# API Docs

## Company

### Get all companies

GET /company

### Get one company

GET /company/:id

### Create new company

POST /company

```
// Request Body
{
  displayName: "Cool Company"
}
```

### Update a company

PUT /company/:id

```
// Request Body
{
  displayName: "Cool Company"
}
```

### Create a workspace in a company

POST /company/:id/workspace

```
// Request Body
{
  displayName: "Cool Company"
}
```

### Update a workspace

PUT /company/:id/workspace/:workspace_id

```
// Request Body
{
  displayName: "Cool Company"
}
```

### Assign a user to a workspace

POST /company/:id/workspace/:workspace_id/user/:user_id

### Remove a user from a workspace

DELETE /company/:id/workspace/:workspace_id/user/:user_id

## User

### Get all users

GET /user

### Get a single user

GET /user/:id

### Create a user

POST /user

```
// Request Body
{
  email: "email@email.com",
  role: "admin"
}
```
