#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

#[macro_use]
extern crate rocket_contrib;

mod routes;

use rocket_contrib::json::JsonValue;

#[catch(404)]
fn not_found() -> JsonValue {
    json!({
        "message": "404 not found"
    })
}

pub fn rocket() -> rocket::Rocket {
    return rocket::ignite()
        .register(catchers![not_found])
        .mount("/", routes![routes::list_card, routes::create_card,]);
}
