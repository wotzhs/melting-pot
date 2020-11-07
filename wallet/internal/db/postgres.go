package db

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	_ "github.com/lib/pq"
)

var Conn *sql.DB

func init() {
	conn, err := sql.Open("postgres", "postgresql://postgres@localhost:5432?sslmode=disable")
	if err != nil {
		log.Fatalf("sql.Open() err: %v", err)
	}

	if err := conn.Ping(); err != nil {
		log.Fatalf("conn.Ping() err: %v", err)
	}

	driver, err := postgres.WithInstance(conn, &postgres.Config{})
	if err != nil {
		log.Fatalf("postgres.NewWithDatabaseInstance() err: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://../wallet/migrations",
		"postgres", driver,
	)
	if err != nil {
		log.Fatalf("migrate.NewWithDatabaseInstance() err: %v", err)
	}
	if err := m.Up(); err != nil {
		log.Printf("migrate.Up() err: %v", err)
	}

	Conn = conn
}
