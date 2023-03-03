<!-- @format -->

# README

Front end UI for image compression web app.

The project is built with React, TypeScript, SCSS and MUI.

## Development

Add `.env.development.local` file and set the environment variables:

```text
REACT_APP_PROXY_ENDPOINT="http://xxx:xxx" # address of forwarder server
```


```sh
# install dependencies
npm i
# start development server
npm start
```


```sh
# build docker image
docker build -t frontend .

# run docker image
docker run -p 3000:80 frontend

```
