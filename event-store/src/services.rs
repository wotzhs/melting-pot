use crate::db;
use crate::event_store as event_store_proto;
use event_store_proto::Event;

pub mod event_store {
    use super::*;

    pub async fn save_event(
        event: Event,
        event_data: serde_json::Value,
    ) -> Result<Vec<u8>, tokio_postgres::Error> {
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
                    &event.name,
                    &event.aggregate_id,
                    &event.aggregate_type,
                    &event_data,
                ],
            )
            .await;

        if rows.is_err() {
            return Err(rows.unwrap_err());
        }

        Ok(rows.unwrap().iter().next().unwrap().get(0))
    }
}
