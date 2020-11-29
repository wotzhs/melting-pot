use crate::clients::event_store::EventStore;
use crate::db;
use crate::workers::Workers;
use futures::{executor::block_on, StreamExt};
use ratsio::{RatsioError, StanClient, StanOptions};
use std::sync::Arc;

pub struct Stan {
    pub client: Arc<StanClient>,
}

impl Default for Stan {
    fn default() -> Self {
        Stan {
            client: block_on(init()).unwrap(),
        }
    }
}

pub async fn init() -> Result<Arc<StanClient>, RatsioError> {
    let client_id = "card".to_string();
    let stan_server_url = "localhost:4222";
    let cluster_name = "melting-pot";
    let opts = StanOptions::with_options(stan_server_url, cluster_name, &client_id[..]);
    let sc = StanClient::from_options(opts).await?;
    Ok(sc)
}

impl Stan {
    pub async fn subscribes(&self, rocket: rocket::Rocket) -> Result<(), RatsioError> {
        let event_workers = Workers {
            event_store_client: EventStore::default().client,
        };

        let user_created_subject = "user_created";
        let queue_group = None;
        let durable_name = Some("durable-card");

        let (sid, mut subscription) = self
            .client
            .subscribe(user_created_subject, queue_group, durable_name)
            .await?;

        println!("subscribed sid: {:?}", sid);

        tokio::spawn(async move {
            while let Some(message) = subscription.next().await {
                let payload = String::from_utf8_lossy(&message.payload);
                println!(
                    "Received message subject: {:?}, payload: {:?}",
                    &message.subject, payload,
                );

                let conn = db::DbConn::get_one(&rocket).unwrap();
                event_workers
                    .clone()
                    .handle_user_created(payload.to_string(), conn)
                    .await;
            }
        });
        Ok(())
    }
}
