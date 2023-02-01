# README

## RUN directly

```sh
pip install -r requirements.txt

# development mode
flask run

# or production mode
python app.py
```

## RUN in docker

```sh
docker build -t flask .

docker run -it -p 5000:5000 --name flask flask
```