package internal

import (
	"encoding/json"
	"log"
	"melting_pot/wallet/internal/services"
	"net/http"
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
	}

	wallet, err := services.CreateWallet(reqBody.UserID)
	if err != nil {
		log.Printf("services.CreateWallet() err: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}

	res, err := json.Marshal(wallet)
	if err != nil {
		log.Printf("json.Marhsal() err: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}

	w.Write(res)
}