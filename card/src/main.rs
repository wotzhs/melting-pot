use card;

#[tokio::main]
async fn main() {
    card::stan_connect().await;
    card::rocket().launch();
}
