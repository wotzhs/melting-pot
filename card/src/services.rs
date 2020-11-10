pub mod card {
    use crate::db;
    use crate::models;
    use rand::Rng;
    use uuid::Uuid;

    fn generate_card_number() -> String {
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

    pub fn list_card() -> Result<models::Card, postgres::Error> {}

    pub fn create_card(conn: db::DbConn, user_id: &str) -> Result<models::Card, postgres::Error> {
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
                Ok(models::Card {
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
