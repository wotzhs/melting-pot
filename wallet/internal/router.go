package internal

import "net/http"

var router *http.ServeMux

func init() {
	router = http.NewServeMux()
	router.HandleFunc("/", WalletHandler)
}
