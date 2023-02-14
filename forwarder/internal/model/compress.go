package model

import (
	"context"
	modelgrpcclient "forwarder/internal/model-grpc-client"
	model "forwarder/internal/model/protos"
	"time"
)

type CompressRPCRequest struct {
	Image     []byte
	FileName  string
	FileType  string
	ModelName string
	Metric    string
	Quality   int
}

type CompressRPCResponse struct {
	Metrics        map[string]string
	CompressedFile []byte
}

func CompressImage(req *CompressRPCRequest) (resp *CompressRPCResponse, err error) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	response, err := modelgrpcclient.CompressModelClient.CompressOneImage(ctx,
		&model.CompressOneFileRequest{
			FileName:  req.FileName,
			FileType:  req.FileType,
			ModelName: req.ModelName,
			Metric:    req.Metric,
			Quality:   int32(req.Quality),
			FileData:  req.Image,
		})

	if err != nil {
		return nil, err
	}

	return &CompressRPCResponse{
		Metrics:        response.Metrics,
		CompressedFile: response.CompressedFile,
	}, nil

}
