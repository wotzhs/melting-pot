use crate::event_store;
use crate::services;
use event_store::{event_store_server, Event, EventResponse};
use ratsio::StanClient;
use std::error::Error;
use std::sync::Arc;
use tonic::{Code, Request, Response, Status};

pub struct EventStore {
    pub sc: Arc<StanClient>,
}

#[tonic::async_trait]
impl event_store_server::EventStore for EventStore {
    async fn publish(&self, request: Request<Event>) -> Result<Response<EventResponse>, Status> {
        println!("Got a request: {:?}", request);

        let event: Event = request.into_inner();

        let event_data = serde_json::from_str(&event.data);
        if (event_data.is_err()) {
            return Err(Status::new(
                Code::InvalidArgument,
                Error::to_string(&event_data.unwrap_err()),
            ));
        }

        let event_data_value: serde_json::Value = event_data.unwrap();

        let result = services::event_store::save_event(&event, event_data_value).await;

        if (result.is_err()) {
            return Err(Status::new(
                Code::Internal,
                Error::to_string(&result.unwrap_err()),
            ));
        }

        match self.sc.publish(&event.name, event.data.as_bytes()).await {
            Ok(_) => println!("published event: {:?}", event),
            Err(e) => {
                println!("failed to publish event: {:?} error: {:?}", event, e);
                return Err(Status::new(Code::Internal, Error::to_string(&e)));
            }
        }

        let reply = event_store::EventResponse {
            event_id: String::from_utf8_lossy(&result.unwrap()).to_string(),
        };

        Ok(Response::new(reply))
    }
}
