package compress

import (
	"encoding/json"
	customerror "forwarder/internal/custom-error"
	"forwarder/internal/model"
	"mime/multipart"

	"github.com/gin-gonic/gin"
)

type CompressOneImageRequest struct {
	FileName string                `form:"filename" binding:"required"`
	Model    string                `form:"model" binding:"required"`
	Filetype string                `form:"filetype" binding:"required"`
	Metric   string                `form:"metric" binding:"required"`
	Quality  int                   `form:"quality" binding:"required"`
	File     *multipart.FileHeader `form:"file" binding:"required"`
}

type CompressOneImageResponse struct {
	Metrics map[string]string `json:"metrics"`
	Data    []byte            `json:"data"`
}

func CompressOneImage(c *gin.Context) (any, *customerror.CError) {
	// extract request from multipart/formdata and bind to struct
	var req CompressOneImageRequest
	if err := c.ShouldBind(&req); err != nil {
		return nil, customerror.GenInvalidParamError(err)
	}

	// convert multipart.FileHeader to []byte
	fileBytes, err := convertFileToByte(req.File)
	if err != nil {
		return nil, customerror.GenCompressFailedError(err)
	}

	// call model to compress image
	response, err := model.CompressImage(&model.CompressRPCRequest{
		Image:     fileBytes,
		FileName:  req.FileName,
		FileType:  req.Filetype,
		ModelName: req.Model,
		Metric:    req.Metric,
		Quality:   req.Quality,
	})

	if err != nil {
		return nil, customerror.GenCompressFailedError(err)
	}

	metricStr, err := json.Marshal(response.Metrics)
	if err != nil {
		return nil, customerror.GenCompressFailedError(err)
	}

	// add metrics to response header's X-Metrics
	c.Writer.Header().Set("X-Metrics", string(metricStr))

	// add the file to response body
	c.Data(200, "application/octet-stream", response.CompressedFile)

	return nil, nil
}

type AutoCompressOneImageRequest struct {
	FileName string `form:"filename" binding:"required"`
	Filetype string `form:"filetype" binding:"required"`
	Metric   string `form:"metric" binding:"required"`
	// Quality: low, medium or high, not required
	Quality string                `form:"quality"`
	File    *multipart.FileHeader `form:"file" binding:"required"`
}

type AutoCompressOneImageResponse struct {
	Metrics map[string]string `json:"metrics"`
	Data    []byte            `json:"data"`
}

// TODO 更新File 为*multipart.FileHeader
func AutoCompressOneImage(c *gin.Context) (any, *customerror.CError) {
	// extract request form data and bind to struct
	var req AutoCompressOneImageRequest
	if err := c.ShouldBind(&req); err != nil {
		return nil, customerror.GenInvalidParamError(err)
	}

	fileBytes, err := convertFileToByte(req.File)
	if err != nil {
		return nil, customerror.GenCompressFailedError(err)
	}

	// call model to classify image
	classifyResp, err := model.ClassifyImage(&model.ClassifyRPCRequest{
		Image: fileBytes,
	})

	if err != nil {
		return nil, customerror.GenClassifyFailedError(err)
	}

	imageLabel := classifyResp.Result

	quality, modelName := getModelNameByLabel(imageLabel, req.Metric, req.Quality)
	transformedQuality := transformQuality(quality, modelName)

	// call model to compress image
	compressResp, err := model.CompressImage(&model.CompressRPCRequest{
		Image:     fileBytes,
		FileName:  req.FileName,
		FileType:  req.Filetype,
		ModelName: modelName,
		Metric:    req.Metric,
		Quality:   transformedQuality,
	})

	if err != nil {
		return nil, customerror.GenCompressFailedError(err)
	}

	metricStr, err := json.Marshal(compressResp.Metrics)
	if err != nil {
		return nil, customerror.GenCompressFailedError(err)
	}

	// add metrics to response header's X-Metrics
	c.Writer.Header().Set("X-Metrics", string(metricStr))

	// add the file to response body
	c.Data(200, "application/octet-stream", compressResp.CompressedFile)

	return nil, nil
}
