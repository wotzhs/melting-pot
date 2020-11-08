use rocket::data::{self, FromDataSimple};
use rocket::http::Status;
use rocket::{Data, Outcome::*, Request};
use serde::Deserialize;
use std::io::Read;
use uuid::Uuid;

pub struct Card {
    id: Uuid,
    user_id: String,
    number: String,
    created_at: std::time::SystemTime,
    updated_at: std::time::SystemTime,
}

#[derive(Debug, PartialEq, Eq, Deserialize)]
pub struct CreateCardRequest {
    user_id: String,
}
