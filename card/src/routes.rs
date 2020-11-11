use crate::db;
use crate::models::card::CreateCardRequest;
use crate::services::card;
use rocket::http::RawStr;
use rocket_contrib::json::{Json, JsonValue};
use std::error::Error;

#[get("/")]
pub fn list_card(conn: db::DbConn) -> JsonValue {
    let res = card::list_card(conn);
    match res {
        Ok(cards) => json!(cards),
        Err(e) => {
            println!("list_card() err: {}", e);
            json!({
                "message": Error::to_string(&e),
            })
        }
    }
}

#[get("/<id>")]
pub fn get_card(conn: db::DbConn, id: &RawStr) -> JsonValue {
    let res = card::get_card(conn, id);
    match res {
        Ok(card) => json!(card),
        Err(e) => {
            println!("get_card() err: {}", e);
            json!({
                "message": &e.to_string(),
            })
        }
    }
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
