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
		UserID string `json:"id"`
		Code   string `json:"code"`
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
			log.Printf("w.EventStoreClient.Publish() event: %v, err: %v", &event, err)
		}

		log.Printf("processed event id: %v", eID)

		return
	}

	pubEventData := struct {
		WalletID string `json:"wallet_id"`
		UserID   string `json:"user_id"`
		Code     string `json:"code"`
	}{
		WalletID: wallet.ID.String(),
		UserID:   wallet.UserID,
		Code:     eventData.Code,
	}

	b, err := json.Marshal(pubEventData)
	if err != nil {
		log.Printf("json.Marshal() err: %v", err)
	}

	event.Data = string(b)
	eID, err := w.EvenStoreClient.Publish(context.TODO(), &event)
	if err != nil {
		log.Printf("w.EventStoreClient.Publish() event: %v, err: %v", &event, err)
	}

	log.Printf("processed event id: %v", eID)
}

func (w *Stan) HandlePromotionApplied(m *stan.Msg) {
	var eventData struct {
		WalletID string  `json:"wallet_id"`
		UserID   string  `json:"user_id"`
		Status   bool    `json:"status"`
		Reward   float32 `json:"reward"`
	}

	if err := json.Unmarshal(m.Data, &eventData); err != nil {
		log.Printf("err in unmarshaling eventData: %v", err)
		return
	}

	event := event_store.Event{
		Name:          "wallet_updated",
		AggregateId:   eventData.UserID,
		AggregateType: "user",
	}

	wallet, err := services.UpdateWallet(eventData.WalletID, eventData.Reward)
	if err != nil {
		log.Printf("services.UpdateWallet() err: %v", err)

		event.Name = "wallet_update_failed"
		event.Data = fmt.Sprintf("%v", err)
		eID, err := w.EvenStoreClient.Publish(context.TODO(), &event)
		if err != nil {
			log.Printf("w.EventStoreClient.Publish() err: %v", &event)
		}

		log.Printf("processed event id: %v", eID)

		return
	}

	pubEventData := struct {
		UserID   string  `json:"user_id"`
		WalletID string  `json:"wallet_id"`
		Balance  float32 `json:"balance"`
	}{
		UserID:   wallet.UserID,
		WalletID: wallet.ID.String(),
		Balance:  wallet.Balance,
	}

	b, err := json.Marshal(pubEventData)
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
