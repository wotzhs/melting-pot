use crate::clients;
use crate::db;
use crate::event_store;
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
        Ok(card) => {
            let mut event = event_store::Event::new();
            event.set_name("card_created".to_string());
            event.set_aggregate_id("test".to_string());
            event.set_aggregate_type("test".to_string());
            event.set_data(json!(card).to_string());

            let client = clients::event_store::event_store();
            let res = client.publish(&event);
            if res.is_err() {
                return json!({"message": Error::to_string(&res.unwrap_err())});
            }
            println!("processed event: {:?}", res.unwrap());
            json!(card)
        }
        Err(e) => json!({
            "message": Error::to_string(&e),
        }),
    }
}
