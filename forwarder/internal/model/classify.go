package model

import (
	"context"
	modelgrpcclient "forwarder/internal/model-grpc-client"
	model "forwarder/internal/model/protos"
	"time"
)

type ClassifyRPCRequest struct {
	Image []byte
}

type ClassifyRPCResponse struct {
	// Result will be one of the following: "simple", "complex", "textured"
	Result      string
	Probability float32
}

func ClassifyImage(req *ClassifyRPCRequest) (resp *ClassifyRPCResponse, err error) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	response, err := modelgrpcclient.ClassifyModelClient.ClassifyOneImage(ctx,
		&model.ClassifyOneImageRequest{
			ImageData: req.Image,
		})

	if err != nil {
		return nil, err
	}

	return &ClassifyRPCResponse{
		Result:      response.Result,
		Probability: response.Probability,
	}, nil

}
