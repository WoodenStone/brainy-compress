# Image for flask and pytorch
FROM python:3.8

ADD . /app

WORKDIR /app

RUN pip install -r requirements.txt

ENV HOST_IP=0.0.0.0 PORT=5000

CMD ["python", "app.py"]
