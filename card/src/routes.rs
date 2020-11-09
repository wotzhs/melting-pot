use crate::db;
use crate::models::CreateCardRequest;
use crate::services::card;
use rocket_contrib::json::Json;
use rocket_contrib::json::JsonValue;
use std::error::Error;

#[get("/")]
pub fn list_card() -> &'static str {
    "Hello World"
}

#[post("/", format = "json", data = "<req>")]
pub fn create_card(conn: db::DbConn, req: Json<CreateCardRequest>) -> JsonValue {
    println!("received: {:?}", req);
    let res = card::create_card(conn, &req.user_id);
    match res {
        Ok(card) => json!(card),
        Err(e) => json!({
            "message": Error::to_string(&e),
        }),
    }
}
