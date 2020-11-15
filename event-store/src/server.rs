use tonic::transport::Server;

use event_store::event_store_server::EventStoreServer;

mod db;
mod services;

pub mod event_store {
    tonic::include_proto!("event_store");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let event_store = services::EventStoreService::default();
    println!("Event Store service listening at: {}", addr);

    Server::builder()
        .add_service(EventStoreServer::new(event_store))
        .serve(addr)
        .await?;

    Ok(())
}
