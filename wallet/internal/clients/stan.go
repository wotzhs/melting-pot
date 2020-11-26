package clients

import (
	"log"

	"melting_pot/wallet/internal/workers"

	stan "github.com/nats-io/stan.go"
)

type Stan struct {
	client stan.Conn
}

func (s *Stan) Default() {
	clusterID := "melting-pot"
	clientID := "wallet"
	sc, err := stan.Connect(clusterID, clientID)
	if err != nil {
		log.Printf("Failed to connect to nats streaming server, err: %v", err)
	}
	s.client = sc
}

func (s *Stan) Subsribes() {
	eventWorker := workers.Stan{EventStore}
	s.client.Subscribe("account_created", func(m *stan.Msg) {
		eventWorker.HandleAccountCreated(m)
	}, stan.DurableName("durable-wallet"))
}
