pub mod card {
    use crate::db;
    use crate::models::card::{generate_card_number, Card};
    use uuid::Uuid;

    pub fn list_card(conn: db::DbConn) -> Result<Vec<Card>, postgres::Error> {
        let res = conn.query("SELECT * from cards", &[]);

        let mut cards: Vec<Card> = Vec::new();

        match res {
            Ok(rows) => {
                for row in &rows {
                    cards.push(Card {
                        id: row.get(0),
                        user_id: row.get(1),
                        number: row.get(2),
                        created_at: row.get(3),
                        updated_at: row.get(4),
                    });
                }
                Ok(cards)
            }

            Err(e) => Err(e),
        }
    }

    pub fn create_card(conn: db::DbConn, user_id: &str) -> Result<Card, postgres::Error> {
        let id = Uuid::new_v4();
        let card_number = generate_card_number();
        let res = conn.query(
            "INSERT INTO cards (
                id,
                user_id,
                number
            ) 
            VALUES ($1, $2, $3)
            RETURNING *",
            &[&id, &user_id, &card_number],
        );

        match res {
            Ok(rows) => {
                let row = rows.iter().next().unwrap();
                Ok(Card {
                    id: row.get(0),
                    user_id: row.get(1),
                    number: row.get(2),
                    created_at: row.get(3),
                    updated_at: row.get(4),
                })
            }
            Err(e) => {
                println!("create_card() err: {:?}", e);
                Err(e)
            }
        }
    }
}

// credit: https://github.com/serde-rs/serde/issues/1151
pub mod datetime_serializer {
    use chrono::naive::NaiveDateTime;
    use chrono::{DateTime, Utc};
    use serde::{Serialize, Serializer};
    fn time_to_json(t: NaiveDateTime) -> String {
        DateTime::<Utc>::from_utc(t, Utc).to_rfc3339()
    }

    pub fn serialize<S: Serializer>(
        time: &NaiveDateTime,
        serializer: S,
    ) -> Result<S::Ok, S::Error> {
        time_to_json(time.clone()).serialize(serializer)
    }
}
