use crate::services::datetime_serializer;
use chrono::naive::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub mod card {
    use super::*;
    use rand::Rng;

    #[derive(Debug, FromForm)]
    pub struct Query {
        pub user_id: String,
    }

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

    pub fn generate_card_number() -> String {
        const CHARSET: &[u8] = b"0123456789";
        const CARD_NUMBER_LEN: usize = 12;

        let mut rng = rand::thread_rng();

        let card_number: String = (0..CARD_NUMBER_LEN)
            .map(|_| {
                let i = rng.gen_range(0, CHARSET.len());
                return CHARSET[i] as char;
            })
            .collect();
        return card_number;
    }
}
