# README

## Start

Add `config.yaml` inside `config` folder. Example config:
```yaml
ModelServer:
  addr: xxx.xxx.xxx.xxx:xxxxx

Http:
  addr: x.x.x.x
  port: xxxx
```

Then launch directly:

```sh
go run ./cmd/server
```

Or run in docker:
```sh
# build
docker build -t forwarder .

# run
docker run -p 5000:5000 -v ${PWD}/config:/app/config forwarder
```
