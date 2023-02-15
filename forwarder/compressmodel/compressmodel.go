package compress_model

import (
	"context"
	model "forwarder/internal/model/protos"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

const (
	addr      = "localhost:50051"
	fileName  = "kumamon.jpeg"
	fileType  = "image/jpeg"
	modelName = "bmshj2018-factorized"
	metric    = "mse"
	quality   = 1
)

func CompressImage(image []byte) {

	conn, err := grpc.Dial(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}
	defer conn.Close()

	compressionClient := model.NewImageCompressServiceClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	response, err := compressionClient.CompressOneImage(ctx,
		&model.CompressOneFileRequest{
			FileName:  fileName,
			FileType:  fileType,
			ModelName: modelName,
			Metric:    metric,
			Quality:   quality,
			FileData:  image,
		})

	if err != nil {
		log.Fatalf("failed to compress: %v", err)
	}

	log.Printf("Compressed image: %v", response.Metrics)

}
