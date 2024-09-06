// use std::net::TcpListener;
use std::net::TcpStream;
use std::io::prelude::*;
use std::fs;
use std::thread;
use std::time::Duration;
use milady_pool_server::ThreadPool;
use milady_pool_lib::fibonacci;

// New
use axum::{
  extract::{Path, State},
  http::StatusCode,
  routing::{get, post},
  Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
  let server_address = "127.0.0.1:7878";
  let listener = TcpListener::bind(server_address).await.expect("Could not create TCP Listener");

  println!("Server listening on port 7878");

  let app = Router::new()
    .route("/", get(|| async { "Welcome to Milady Pool ZKP API!" }));
    // .route("/fibonacci/:id", get(fibonacci_handler))
    // .route("/log", post(log_handler));

  axum::serve(listener,app).await.expect("Server failed to start");

}
// fn main () {
//   let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

//   let pool = ThreadPool::new(4);

//   for stream in listener.incoming() {
//     let stream  = stream.unwrap();

//     pool.execute(|| {
//       handle_connection(stream);
//     });
//   }
// }

fn handle_connection(mut stream: TcpStream) {
  let mut buffer = [0; 1024];
  stream.read(&mut buffer).unwrap();

  let get = b"GET / HTTP/1.1\r\n";
  let sleep = b"GET /sleep HTTP/1.1\r\n";
  let post = b"POST /log HTTP/1.1\r\n";


  if buffer.starts_with(post) {
    let contents = String::from_utf8_lossy(&buffer[..]);
    println!("Received POST request with data: {}", contents);
    // TODO: Come back to this

  } else if buffer.starts_with(get) {
    send_response(stream, "HTTP/1.1 200 OK", "server/index.html");
  } else if buffer.starts_with(sleep) {
    thread::sleep(Duration::from_secs(5));
    send_response(stream, "HTTP/1.1 200 OK", "server/index.html");
  } else if buffer.starts_with(get) {
    let id = 5;
    let (a, b) = call_fibonacci(id);
    let response = format!("HTTP/1.1 200 OK\r\n\r\nThe fibonacci number at position {} is: {} and {}", id, a, b);
    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
  } else {
    send_response(stream, "HTTP/1.1 404 NOT FOUND", "server/404.html");
  }
}

fn send_response(mut stream: TcpStream, status_line: &str, filename: &str) {
  let contents = fs::read_to_string(filename).unwrap();
  let response = format!(
    "{}\r\nContent-Length: {}\r\n\r\n{}",
    status_line,
    contents.len(),
    contents
  );
  stream.write(response.as_bytes()).unwrap();
  stream.flush().unwrap();
}

fn call_fibonacci(n: u32) -> (u32, u32) {
  let (a, b)= fibonacci(n);
  (a, b)
}



