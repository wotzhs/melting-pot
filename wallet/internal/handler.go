package internal

import (
	"context"
	"encoding/json"
	"log"
	"melting_pot/wallet/internal/clients"
	"melting_pot/wallet/internal/services"
	"net/http"
	"proto/event_store"
)

type CreateWalletRequest struct {
	UserID string `json:"user_id"`
}

func WalletHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		ListWallets(w, r)
	case "POST":
		Createwallet(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func ListWallets(w http.ResponseWriter, r *http.Request) {
	wallets, err := services.Listwallets()
	if err != nil {
		log.Printf("services.ListWallets() err: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}

	res, err := json.Marshal(wallets)
	if err != nil {
		log.Printf("json.Marhsal() err: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}

	w.Write(res)
}

func Createwallet(w http.ResponseWriter, r *http.Request) {
	reqBody := &CreateWalletRequest{}
	if err := json.NewDecoder(r.Body).Decode(reqBody); err != nil {
		log.Printf("json.Decode() err: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if reqBody.UserID == "" {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	wallet, err := services.CreateWallet(reqBody.UserID)
	if err != nil {
		log.Printf("services.CreateWallet() err: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(wallet)
	if err != nil {
		log.Printf("json.Marhsal() err: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	id, err := clients.EventStore.Publish(context.TODO(), &event_store.Event{Name: "wallet_created", AggregateId: reqBody.UserID, AggregateType: "user", Data: string(res)})
	if err != nil {
		log.Printf("EventStore.Publish() err: %v", err)
		return
	}

	log.Printf("Processed id: %v", id)

	w.Write(res)
}
