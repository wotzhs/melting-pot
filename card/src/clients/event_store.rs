use crate::event_store_grpc;
use std::sync::Arc;

pub fn event_store() -> event_store_grpc::EventStoreClient {
    let new_ch = grpcio::ChannelBuilder::new(Arc::new(grpcio::Environment::new(5)));
    let channel = grpcio::ChannelBuilder::connect(new_ch, "[::1]:50051");
    event_store_grpc::EventStoreClient::new(channel)
}
