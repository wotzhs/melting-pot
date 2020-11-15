extern crate bb8;
extern crate bb8_postgres;

use bb8_postgres::tokio_postgres::NoTls;
use bb8_postgres::PostgresConnectionManager;

pub async fn create_pool() -> bb8::Pool<PostgresConnectionManager<NoTls>> {
    let mgr = PostgresConnectionManager::new_from_stringlike(
        "postgresql://postgres@localhost:5434",
        NoTls,
    )
    .unwrap();
    bb8::Pool::builder().max_size(15).build(mgr).await.unwrap()
}
