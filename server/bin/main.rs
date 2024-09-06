use std::time::Duration;

use axum::{
  extract::{Path, State},
  http::StatusCode,
  routing::{get, post},
  Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::net::TcpListener;
use milady_pool_lib::fibonacci;


#[tokio::main]
async fn main() {
  let server_address = "127.0.0.1:7878";
  let listener = TcpListener::bind(server_address).await.expect("Could not create TCP Listener");

  println!("Server listening on port 7878");

  let app = Router::new()
    .route("/", get(|| async { "Welcome to Milady Pool ZKP API!" }))
    .route("/order", post(order_handler));
    

  axum::serve(listener,app).await.expect("Server failed to start");
}

async fn order_handler(
    Json(task): Json<Order>,
) -> Result<(StatusCode, String), (StatusCode, String)>{
    // TODO: Handle the order (create the proof and trigger a 
    // smart contract transaction via avs)
  Ok((
    StatusCode::CREATED,
    json!({"success":true, "data":""}).to_string(),
  ))
}

#[derive(Deserialize)]
struct Order {}