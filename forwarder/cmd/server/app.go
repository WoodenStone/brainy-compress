package main

import (
	"context"
	"fmt"
	"forwarder/apis/httpapi"
	"forwarder/internal/config"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"time"
)

type App struct {
	Config *config.Config

	wg *sync.WaitGroup

	HTTPServer *http.Server
}

func New(c *config.Config) *App {
	return &App{
		Config: c,
		wg:     &sync.WaitGroup{},
	}
}

func (app *App) signalHandler() {
	app.wg.Add(1)
	go func() {
		defer app.wg.Done()

		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt)
		sig := <-sigint

		log.Printf("Receive signal `%+v`", sig)

		wg := sync.WaitGroup{}

		wg.Add(1)
		go func() {
			defer wg.Done()

			ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
			defer func() {
				// Close database, redis, truncate message queues, etc.
				cancel()
			}()

			log.Printf("Shutdown HttpServer ...")
			if err := app.HTTPServer.Shutdown(ctx); err != nil {
				log.Printf("Shutdown HttpServer error: %v", err)
			}
			log.Printf("Shutdown HttpServer done")
		}()

		wg.Wait()
	}()
}

func (app *App) startHttpServer() {
	addr := fmt.Sprintf("%s:%d", app.Config.HTTP.Addr, app.Config.HTTP.Port)

	app.HTTPServer = &http.Server{
		Addr:              addr,
		Handler:           httpapi.GinHandler(app.Config),
		ReadHeaderTimeout: 3 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       65 * time.Second,
		ErrorLog:          nil,
		BaseContext:       nil,
		ConnContext:       nil,
	}

	if err := app.HTTPServer.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("HttpServer failed to serve: %s, err: %v", addr, err)
	}
}

func (app *App) Run() {
	app.wg.Add(1)
	go func() {
		defer app.wg.Done()
		app.startHttpServer()
	}()

	app.signalHandler()

	app.wg.Wait()

	log.Printf("Compress server exited.")
}
