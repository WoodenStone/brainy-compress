package compress

import "forwarder/internal/config"

// getModelNameByLabel returns the model name and quality for the given label, metric and quality.
// If quality is specified, the model name will be decided by the given quality
func getModelNameByLabel(label, metric, quality string) (autoQuality, modelName string) {
	sc := config.GlobalStrategyConfig
	mn := sc.CompressionStrategy[label][metric]
	if quality != "" {
		return quality, mn
	}
	return sc.CompressionStrategy[label][quality], mn
}

// transformQuality returns the quality for the given quality and model name.
func transformQuality(quality, modelName string) int {
	sc := config.GlobalStrategyConfig
	return sc.QualityMap[quality][modelName]
}
