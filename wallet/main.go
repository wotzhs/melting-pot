package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"message": "hello world"}`))
	})

	log.Printf("Listening on port: %s", ":5001")
	log.Fatal(http.ListenAndServe(":5001", nil))
}
