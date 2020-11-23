use tonic::transport::Server;

use event_store::event_store_server::EventStoreServer;
use ratsio::{StanClient, StanOptions};

mod db;
mod procedures;
mod services;

pub mod event_store {
    tonic::include_proto!("event_store");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;

    let client_id = "event-store";
    let opts = StanOptions::with_options("localhost:4222", "melting-pot", &client_id[..]);

    let event_store = procedures::EventStore {
        sc: StanClient::from_options(opts).await.unwrap(),
        subjects: services::event_store::get_subjects(),
    };

    println!("Event Store service listening at: {}", addr);

    Server::builder()
        .add_service(EventStoreServer::new(event_store))
        .serve(addr)
        .await?;

    Ok(())
}
