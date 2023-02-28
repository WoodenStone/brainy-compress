# README


## preview in local
```sh
# pull up client and server at one time with docker-compose in production mode
docker-compose up -d
```


## development

Check README.md in each folder for more details.

client: [README.md](./frontend/README.md)

server: [README.md](./model-server/README.md)


## Compile proto file

```sh
# model server
python -m grpc_tools.protoc -I./protos --python_out=./model-server/pb/ --pyi_out=./model-server/pb/ --grpc_python_out=./model-server/pb/ ./protos/compress.proto ./protos/classify.proto
# forwarder
protoc --go_out=./forwarder/internal/model --go_opt=paths=source_relative --go-grpc_out=./forwarder/internal/model --go-grpc_opt=paths=source_relative ./protos/compress.proto ./protos/classify.proto
```