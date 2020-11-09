use chrono::naive::NaiveDateTime;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize)]
pub struct Card {
    pub id: Uuid,
    pub user_id: String,
    pub number: String,

    #[serde(with = "datetime_serializer")]
    pub created_at: NaiveDateTime,

    #[serde(with = "datetime_serializer")]
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, PartialEq, Eq, Deserialize)]
pub struct CreateCardRequest {
    pub user_id: String,
}

// credit: https://github.com/serde-rs/serde/issues/1151
pub fn time_to_json(t: NaiveDateTime) -> String {
    DateTime::<Utc>::from_utc(t, Utc).to_rfc3339()
}

mod datetime_serializer {
    use super::*;
    use serde::Serializer;

    pub fn serialize<S: Serializer>(
        time: &NaiveDateTime,
        serializer: S,
    ) -> Result<S::Ok, S::Error> {
        time_to_json(time.clone()).serialize(serializer)
    }
}
