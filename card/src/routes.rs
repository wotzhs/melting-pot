use crate::db;
use crate::models::CreateCardRequest;
use rocket_contrib::json::Json;

#[get("/")]
pub fn list_card() -> &'static str {
    "Hello World"
}

#[post("/", format = "json", data = "<req>")]
pub fn create_card(conn: db::DbConn, req: Json<CreateCardRequest>) -> &'static str {
    println!("received: {:?}", req);
    "card created"
}
