use card;

#[tokio::main]
async fn main() {
    card::stan_connect(card::rocket()).await;
    card::rocket().launch();
}
