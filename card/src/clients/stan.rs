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
    let opts = StanOptions::with_options("localhost:4222", "melting-pot", &client_id[..]);
    let sc = StanClient::from_options(opts).await?;
    Ok(sc)
}

impl Stan {
    pub async fn subscribes(&self) -> Result<(), RatsioError> {
        let (sid, mut subscription) = self.client.subscribe("account.*", None, None).await?;
        tokio::spawn(async move {
            while let Some(message) = subscription.next().await {
                println!(
                    " << 1 >> got stan message --- {:?}\n\t{:?}",
                    &message,
                    String::from_utf8_lossy(message.payload.as_ref())
                );
            }
            println!(" ----- the subscription loop is done ----- ")
        });
        Ok(())
    }
}
