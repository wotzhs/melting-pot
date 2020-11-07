package models

import (
	"math/rand"
	"time"

	"github.com/oklog/ulid/v2"
)

type Wallet struct {
	ID        ulid.ULID `json:"id"`
	UserID    string    `json:"user_id"`
	Balance   float32   `json:"balance"`
	CreatedAt time.Time `json:"created_at"`
	UpdateAt  time.Time `json:"updated_at"`
}

func (w *Wallet) InitID() (err error) {
	t := time.Unix(time.Now().Unix(), time.Now().UnixNano())
	entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
	w.ID, err = ulid.New(ulid.Timestamp(t), entropy)
	return
}
