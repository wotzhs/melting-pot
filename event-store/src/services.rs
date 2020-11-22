use crate::db;
use crate::event_store;
use event_store::event_store_server::EventStore;
use event_store::{Event, EventResponse};
use std::error::Error;
use tonic::{Code, Request, Response, Status};

#[derive(Debug, Default)]
pub struct EventStoreService {}

#[tonic::async_trait]
impl EventStore for EventStoreService {
    async fn publish(&self, request: Request<Event>) -> Result<Response<EventResponse>, Status> {
        println!("Got a request: {:?}", request);

        let Event {
            name,
            aggregate_id,
            aggregate_type,
            data,
        } = &request.into_inner();

        let event_data = serde_json::from_str(data);
        if (event_data.is_err()) {
            return Err(Status::new(
                Code::InvalidArgument,
                Error::to_string(&event_data.unwrap_err()),
            ));
        }
        let event_data_value: serde_json::Value = event_data.unwrap();

        let pool = db::create_pool().await;
        let conn = pool.get().await.unwrap();
        let rows = conn
            .query(
                " 
                INSERT INTO events (id, name, aggregate_id, aggregate_type, data)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
                ",
                &[
                    &ulid::Ulid::new().to_string().as_bytes(),
                    &name,
                    &aggregate_id,
                    &aggregate_type,
                    &event_data_value,
                ],
            )
            .await
            .unwrap();

        let id: Vec<u8> = rows.iter().next().unwrap().get(0);

        let reply = event_store::EventResponse {
            event_id: String::from_utf8_lossy(&id).to_string(),
            error: String::from(""),
        };

        Ok(Response::new(reply))
    }
}
