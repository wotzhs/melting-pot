#[get("/")]
pub fn list_card() -> &'static str {
    "Hello World"
}

#[post("/")]
pub fn create_card() -> &'static str {
    "card created"
}
