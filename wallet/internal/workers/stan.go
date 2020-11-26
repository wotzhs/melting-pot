package workers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"melting_pot/wallet/internal/services"
	"proto/event_store"

	stan "github.com/nats-io/stan.go"
)

type Stan struct {
	EvenStoreClient event_store.EventStoreClient
}

func (w *Stan) HandleUserCreated(m *stan.Msg) {
	var eventData struct {
		UserID string `json:"user_id"`
	}

	if err := json.Unmarshal(m.Data, &eventData); err != nil {
		log.Printf("err in unmarshaling eventData: %v", err)
		return
	}

	event := event_store.Event{
		Name:          "wallet_created",
		AggregateId:   eventData.UserID,
		AggregateType: "user",
	}

	wallet, err := services.CreateWallet(eventData.UserID)
	if err != nil {
		log.Printf("services.CreateWallet() err: %v", err)

		event.Name = "wallet_create_failed"
		event.Data = fmt.Sprintf("%v", err)
		eID, err := w.EvenStoreClient.Publish(context.TODO(), &event)
		if err != nil {
			log.Printf("w.EventStoreClient.Publish() err: %v", &event)
		}

		log.Printf("processed event id: %v", eID)

		return
	}

	b, err := json.Marshal(wallet)
	if err != nil {
		log.Printf("json.Marshal() err: %v", err)
	}

	event.Data = string(b)
	eID, err := w.EvenStoreClient.Publish(context.TODO(), &event)
	if err != nil {
		log.Printf("w.EventStoreClient.Publish() err: %v", &event)
	}

	log.Printf("processed event id: %v", eID)
}
