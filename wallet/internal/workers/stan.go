package workers

import (
	"log"
	"proto/event_store"

	stan "github.com/nats-io/stan.go"
)

type Stan struct {
	EvenStoreClient event_store.EventStoreClient
}

func (w *Stan) HandleAccountCreated(m *stan.Msg) {
	log.Printf("received message %v", m)
}
