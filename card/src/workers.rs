use crate::db;
use crate::event_store;
use crate::event_store_grpc::EventStoreClient;
use crate::services;
use std::error::Error;

#[derive(Clone)]
pub struct Workers {
    pub event_store_client: EventStoreClient,
}

impl Workers {
    pub async fn handle_user_created(self, message: String, conn: db::DbConn) {
        let event_data: serde_json::Value = match serde_json::from_str(&message) {
            Ok(data) => data,
            Err(e) => {
                println!("Invalid event data: {}, err: {}", message, e);
                return;
            }
        };

        let user_id = event_data["user_id"].as_str().unwrap();

        let mut event = event_store::Event::new();
        event.set_aggregate_id(user_id.to_string());
        event.set_aggregate_type("user".to_string());

        match services::card::create_card(conn, user_id) {
            Ok(data) => {
                println!("successfully created card for user_id: {}", user_id);

                event.set_name("card_created".to_string());
                event.set_data(json!(data).to_string());

                match self.event_store_client.publish(&event) {
                    Ok(event) => println!("processed event {:?}", event),
                    Err(e) => println!("failed to publish event, err: {}", e),
                }
            }

            Err(e) => {
                println!("failed to create card for user_id: {}, err: {}", user_id, e);

                event.set_name("card_create_failed".to_string());
                let payload = json!({
                    "user_id": user_id,
                    "event_data": message,
                    "error": Error::to_string(&e),
                });
                event.set_data(payload.to_string());

                match self.event_store_client.publish(&event) {
                    Ok(event) => println!("processed event {:?}", event),
                    Err(e) => println!("failed to publish event, err: {}", e),
                }
            }
        };
    }
}
