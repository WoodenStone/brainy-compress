package main

import (
	"flag"
	"forwarder/internal/config"
	modelgrpcclient "forwarder/internal/model-grpc-client"
	"forwarder/internal/utils"
	"log"

	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

func setupFlags() {
	flag.String("config", "", "path to config file")
	flag.Parse()

	pflag.CommandLine.AddGoFlagSet(flag.CommandLine)
	pflag.Parse()
}

func setupConfig() {
	utils.PanicIfError(config.SetupServerConfig(), "Failed to setup server config")
	log.Printf("Server config: %+v", config.GlobalConfig)

	utils.PanicIfError(config.SetupStrategyConfig(), "Failed to setup strategy config")
	log.Printf("Strategy config: %+v", config.GlobalStrategyConfig)
}

func startGRPCClients() {
	utils.PanicIfError(
		modelgrpcclient.InitCompressModelClient(config.GlobalConfig.ModelServer.Addr),
		"Failed to init compress model client",
	)
	utils.PanicIfError(
		modelgrpcclient.InitClassifyModelClient(config.GlobalConfig.ModelServer.Addr),
		"Failed to init quality model client",
	)
}

func Setup() {
	setupFlags()
	utils.PanicIfError(viper.BindPFlags(pflag.CommandLine), "")

	setupConfig()

	startGRPCClients()
}

func main() {
	Setup()

	New(config.GlobalConfig).Run()
}
