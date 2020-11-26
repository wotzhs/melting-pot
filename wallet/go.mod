module melting_pot/wallet

go 1.15

require (
	github.com/golang-migrate/migrate/v4 v4.13.0
	github.com/lib/pq v1.8.0
	github.com/nats-io/stan.go v0.7.0
	github.com/oklog/ulid/v2 v2.0.2
	google.golang.org/grpc v1.31.0
	proto/event_store v0.0.0-00010101000000-000000000000
)

replace proto/event_store => ../proto/event_store
