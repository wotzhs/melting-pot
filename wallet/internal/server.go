package internal

import (
	"context"
	"log"
	"melting_pot/wallet/internal/clients"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const port string = ":5001"

func StartServer() {
	GRPCclients := clients.RegisterGRPCClients()
	for _, client := range GRPCclients {
		defer client.Close()
	}

	stan := &clients.Stan{}
	stan.Default()
	stan.Subsribes()

	server := &http.Server{
		Addr:    port,
		Handler: router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil {
			log.Fatalf("failed to start wallet service err: %v", err)
		}
	}()

	log.Printf("wallet service listening at %s", port)

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-shutdown

	log.Printf("shutdown command received, shutting down server")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	server.Shutdown(ctx)

	log.Printf("server shutdown completed properly")
}
