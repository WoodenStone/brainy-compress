# README

## Start
```sh
go run ./cmd/server
```

## Run in docker
```sh
# build
docker build -t forwarder .

# run
docker run -p 5000:5000 -v ${PWD}/config:/app/config forwarder
```