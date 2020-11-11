use rocket_contrib::databases::postgres;

#[database("db")]
pub struct DbConn(postgres::Connection);
