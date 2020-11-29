# Event-store

This service manages the storing and publishing of events.

## Getting started

### Running the service

```shell
# start the databases
docker-compose up -d

# migrate the databases
diesel migration run

# run the service
cargo run --bin eventstore-server
```
