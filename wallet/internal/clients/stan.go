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
	s.client.Subscribe("user_created", func(m *stan.Msg) {
		log.Printf("received message %v", m)
		eventWorker.HandleUserCreated(m)
	}, stan.DurableName("durable-wallet"))

	s.client.Subscribe("promotion_applied", func(m *stan.Msg) {
		log.Printf("received message %v", m)
		eventWorker.HandlePromotionApplied(m)
	}, stan.DurableName("durable-wallet"))
}
