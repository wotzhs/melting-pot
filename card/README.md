# Card

## Getting started

### Generating the grpc codes

```shell
make
```

This service uses the statically generated rust code from the protobuf to create the grpc client, therefore this has to be done prior to starting the service.

### Running the service

```rust
cargo run
```

### Database Migrations

This service use the [diesel](https://diesel.rs/guides/getting-started/) to create and run the igrations.
