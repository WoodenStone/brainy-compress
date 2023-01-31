<!-- @format -->

# README

Front end UI for image compression web app.

The project is built with React, TypeScript, SCSS and MUI.

## Development

```sh
# install dependencies
npm i
# start development server
npm start
```


```sh
# build docker image
docker build -t react-ng .

# run docker image
docker run -p 3000:80 --name react-ng react-ng

```