# Image for flask and pytorch
FROM python:3.8

ADD . /app

WORKDIR /app

VOLUME [ "/data/models" ]

ENV TORCH_HOME=/data/models

RUN pip install -r requirements.txt

# download all pretrained models before running the container
RUN wget -i models.txt -P ${TORCH_HOME}/hub/checkpoints

ENV HOST_IP=0.0.0.0 PORT=5000

CMD ["python", "app.py"]
