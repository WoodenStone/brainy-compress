package config

import (
	"encoding/json"
	"fmt"
	"forwarder/internal/utils"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

// Config defines the configuration of the application. It is populated from the
// configuration file.
type Config struct {
	Environment string // 环境
	GinMode     string // Gin Mode
	// 对外 HTTP API 地址
	HTTP struct {
		Addr string
		Port int
	}
	// 模型服务地址
	ModelServer struct {
		Addr string
	}
}

type Quality map[string]int
type CompStrategy map[string]string

type StrategyConfig struct {
	QualityMap          map[string]Quality      `json:"qualityMap"`
	CompressionStrategy map[string]CompStrategy `json:"compressionStrategy"`
}

const (
	defaultConfigFilePath = "./config/config.yaml"
	envKeyConfigFilePath  = "CONFIG_FILE_PATH"
	strategyFilePath      = "./config/strategy.json"
)

var GlobalConfig = &Config{}

var GlobalStrategyConfig = &StrategyConfig{}

func parseConfig(v *Config) error {
	return viper.Unmarshal(v)
}

func getConfigFilePathFromEnv() string {
	return os.Getenv(envKeyConfigFilePath)
}

// GetConfigFilePath returns the path of the configuration file.
// The priority of the configuration file path is as follows:
// 1. The path specified by the --config command line parameter
// 2. The path specified by the CONFIG_FILE_PATH environment variable
// 3. The default path
func GetConfigFilePath() string {
	configFilePath := viper.GetString("config")

	if configFilePath != "" {
		return utils.TryComplementAbsolutePath(configFilePath)
	}

	configFilePath = getConfigFilePathFromEnv()

	if configFilePath != "" {
		return utils.TryComplementAbsolutePath(configFilePath)
	}

	configFilePath = defaultConfigFilePath
	return utils.TryComplementAbsolutePath(configFilePath)
}

func setupFileConfig() error {
	configFilePath := GetConfigFilePath()

	viper.AddConfigPath(filepath.Dir(configFilePath))
	viper.SetConfigName(utils.GetFileName(configFilePath))
	viper.SetConfigType(filepath.Ext(configFilePath)[1:])

	log.Printf("config file path: %s\n", configFilePath)

	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("failed to read in config: %+v", err)
	}

	return parseConfig(GlobalConfig)
}

var (
	envKeyGinMode     = "GIN_MODE"
	envKeyEnvironment = "ENVIRONMENT"
)

func bindEnv() {
	_ = viper.BindEnv(envKeyGinMode)
	_ = viper.BindEnv(envKeyEnvironment)
}

func setupConfigFromEnv(c *Config) {
	c.GinMode = viper.GetString(envKeyGinMode)
	c.Environment = viper.GetString(envKeyEnvironment)
}

func setupEnvConfig() {
	bindEnv()
	setupConfigFromEnv(GlobalConfig)
}

func setupDefaultConfig() {
	viper.SetDefault("modelserver.addr", "0.0.0.0:50051")
}

// SetupServerConfig initializes the global configuration.
// The priority of the configuration is as follows:
// 1. The default configuration
// 2. The environment variable configuration
// 3. The configuration file
func SetupServerConfig() error {
	// 调用次序影响配置的优先级
	setupDefaultConfig()
	setupEnvConfig()
	return setupFileConfig()
}

func SetupStrategyConfig() error {
	jsonFile, err := os.Open(strategyFilePath)

	if err != nil {
		return err
	}

	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		return err
	}

	err = json.Unmarshal(byteValue, &GlobalStrategyConfig)
	if err != nil {
		return err
	}
	return nil
}
