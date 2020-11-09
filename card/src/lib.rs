#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

#[macro_use]
extern crate rocket_contrib;

mod db;
mod models;
mod routes;
mod services;

use rocket_contrib::json::JsonValue;

#[catch(404)]
fn not_found() -> JsonValue {
    json!({
        "message": "404 Not found"
    })
}

#[catch(422)]
fn unprocessable_entity() -> JsonValue {
    json!({
        "message": "422 Unprocessable entity"
    })
}

pub fn rocket() -> rocket::Rocket {
    return rocket::ignite()
        .register(catchers![not_found, unprocessable_entity])
        .attach(db::DbConn::fairing())
        .mount("/", routes![routes::list_card, routes::create_card,]);
}
