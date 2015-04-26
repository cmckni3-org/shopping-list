# Shopping List

## Requirements

* node.js >= 0.10
* MongoDB

## Run the application

* Install dependencies
  ```bash
  npm i
  ```

* Copy the `.env` example file
  ```bash
  cp .env.example .env
  ```

* Configure application using `.env`

* Start the server
  ```bash
  NODE_ENV=development npm start
  ```

## Developing the application

* Install `node-dev` to restart the server upon file changes
  ```bash
  npm i -g node-dev
  ```

* Run the application
  ```bash
  NODE_ENV=development node-dev bin/www
  ```
