package compress

import (
	"bytes"
	"forwarder/internal/config"
	"io"
	"mime/multipart"
)

const (
	qualityLabel   = "qualityLabel"
	defaultQuality = "auto"
)

// getModelNameByLabel returns the model name and quality for the given label, metric and quality.
// If quality is specified, the model name will be decided by the given quality automatically.
func getModelNameByLabel(label, metric, quality string) (autoQuality, modelName string) {
	sc := config.GlobalStrategyConfig
	mn := sc.CompressionStrategy[label][metric]
	if quality != "" && quality != defaultQuality {
		return quality, mn
	}
	return sc.CompressionStrategy[label][qualityLabel], mn
}

// transformQuality returns the quality for the given quality and model name.
func transformQuality(quality, modelName string) int {
	sc := config.GlobalStrategyConfig
	return sc.QualityMap[quality][modelName]
}

func convertFileToByte(file *multipart.FileHeader) ([]byte, error) {
	f, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()
	fileBytes := bytes.NewBuffer(nil)
	if _, err = io.Copy(fileBytes, f); err != nil {
		return nil, err
	}
	return fileBytes.Bytes(), nil
}
