# README

A web app built with React, Python, Golang for AI-powered image compression. Auto image compression based on critical image features and manual parameter settings are available. Features include batch compression and download, metrics and model comparison. Core algorithms are from [CompressAI](https://github.com/InterDigitalInc/CompressAI).


## Set up with docker compose
```sh
# pull up client and server at one time with docker-compose in production mode
docker-compose up -d
```


## Development

Check README.md in each folder for more details.

UI: [README.md](./frontend/README.md)

model server: [README.md](./model-server/README.md)

forwarder layer: [README.md](./forwarder/README.md)


## Compile proto files

```sh
# model server
python -m grpc_tools.protoc -I./protos --python_out=./model-server/pb/ --pyi_out=./model-server/pb/ --grpc_python_out=./model-server/pb/ ./protos/compress.proto ./protos/classify.proto
# forwarder
protoc --go_out=./forwarder/internal/model --go_opt=paths=source_relative --go-grpc_out=./forwarder/internal/model --go-grpc_opt=paths=source_relative ./protos/compress.proto ./protos/classify.proto
```
