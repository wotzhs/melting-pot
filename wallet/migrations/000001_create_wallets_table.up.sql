CREATE TABLE IF NOT EXISTS wallets (
	id BYTEA PRIMARY KEY,
	user_id VARCHAR UNIQUE NOT NULL,
	balance NUMERIC(7,2) DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)