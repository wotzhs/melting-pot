package services

import (
	"melting_pot/wallet/internal/db"
	"melting_pot/wallet/internal/models"

	"github.com/oklog/ulid/v2"
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

func UpdateWallet(walletID string, reward float32) (*models.Wallet, error) {
	walletULID, err := ulid.Parse(walletID)
	if err != nil {
		return nil, err
	}

	query := `
		UPDATE wallets
		SET 	balance = balance + $1,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
		RETURNING id, balance
	`

	var wallet models.Wallet
	err = db.Conn.QueryRow(query, reward, walletULID).Scan(
		&wallet.ID,
		&wallet.Balance,
	)
	if err != nil {
		return nil, err
	}

	return &wallet, nil
}
