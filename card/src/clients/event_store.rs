use crate::event_store_grpc;
use std::sync::Arc;

pub struct EventStore {
    pub client: event_store_grpc::EventStoreClient,
}

impl Default for EventStore {
    fn default() -> Self {
        let new_ch = grpcio::ChannelBuilder::new(Arc::new(grpcio::Environment::new(5)));
        let channel = grpcio::ChannelBuilder::connect(new_ch, "[::1]:50051");
        EventStore {
            client: event_store_grpc::EventStoreClient::new(channel),
        }
    }
}
