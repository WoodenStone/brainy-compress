# README

## RUN directly

```sh
pip install -r requirements.txt

python server.py
```

## RUN in docker

```sh
docker build -t model-server .

docker run -it -p 50051:50051 -v ${PWD}/pretrained-model:/app/pretrained-model model-server
```