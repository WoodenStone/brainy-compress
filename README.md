# README


## preview in local
```sh
# pull up client and server at one time with docker-compose in production mode
docker-compose up -d
```


## development

Check README.md in each folder for more details.

client: [README.md](./compress-ui-fe/README.md)

server: [README.md](./flask-model/README.md)


## Compile proto file

```sh

python -m grpc_tools.protoc -I./protos --python_out=./flask-model/pb/ --pyi_out=./flask-model/pb/ --grpc_python_out=./flask-model/pb/ ./protos/compress.proto ./protos/classify.proto

protoc --go_out=./forwarder/internal/model --go_opt=paths=source_relative --go-grpc_out=./forwarder/internal/model --go-grpc_opt=paths=source_relative ./protos/compress.proto ./protos/classify.proto


```