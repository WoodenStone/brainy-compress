# README

## RUN directly

```sh
pip install -r requirements.txt

python server.py
```

## RUN in docker

```sh
docker build -t flask .

docker run -it -p 5000:5000 --name flask flask
```