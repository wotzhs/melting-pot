package services

import (
	"melting_pot/wallet/internal/db"
	"melting_pot/wallet/internal/models"
)

func Listwallets() (*[]models.Wallet, error) {
	query := "SELECT * from wallets"
	rows, err := db.Conn.Query(query)
	if err != nil {
		return nil, err
	}

	wallets := []models.Wallet{}
	for rows.Next() {
		wallet := models.Wallet{}
		err := rows.Scan(
			&wallet.ID,
			&wallet.UserID,
			&wallet.Balance,
			&wallet.CreatedAt,
			&wallet.UpdateAt,
		)
		if err != nil {
			return nil, err
		}

		wallets = append(wallets, wallet)
	}

	return &wallets, nil
}

func CreateWallet(userID string) (*models.Wallet, error) {
	query := `
		INSERT INTO wallets (id, user_id)
		VALUES ($1, $2)
		RETURNING *
	`
	wallet := models.Wallet{}
	if err := wallet.InitID(); err != nil {
		return nil, err
	}

	err := db.Conn.QueryRow(query, wallet.ID, userID).Scan(
		&wallet.ID,
		&wallet.UserID,
		&wallet.Balance,
		&wallet.CreatedAt,
		&wallet.UpdateAt,
	)
	if err != nil {
		return nil, err
	}

	return &wallet, nil
}
