pub mod card {
    use crate::db;
    use crate::models;
    use uuid::Uuid;

    pub fn create_card(conn: db::DbConn, user_id: &str) -> Result<models::Card, postgres::Error> {
        let id = Uuid::new_v4();
        let card_number = String::from(user_id.to_owned() + "asdadsa");
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
