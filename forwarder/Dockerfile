FROM golang:1.18.0-alpine3.14 AS builder

WORKDIR /app

COPY go.* ./
RUN go mod download -x

COPY . ./
RUN GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s" -o bin/forwarder ./cmd/server

FROM golang:1.18.0-alpine3.14

WORKDIR /app

COPY --from=builder /app/bin/forwarder /app/bin/forwarder

ENV GIN_MODE=release

ENTRYPOINT ["/app/bin/forwarder"]

EXPOSE 5000