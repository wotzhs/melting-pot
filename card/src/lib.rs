#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

mod routes;

#[catch(404)]
fn not_found() -> &'static str {
    "404 not found"
}

pub fn rocket() -> rocket::Rocket {
    return rocket::ignite()
        .register(catchers![not_found])
        .mount("/", routes![routes::list_card, routes::create_card,]);
}
