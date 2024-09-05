use std::net::TcpListener;
use std::net::TcpStream;
use std::io::prelude::*;
use std::fs;
use std::thread;
use std::time::Duration;
use server::ThreadPool;



fn main () {
  let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

  let pool = ThreadPool::new(4);

  for stream in listener.incoming() {
    let stream  = stream.unwrap();

    pool.execute(|| {
      handle_connection(stream);
    });
  }


}

fn handle_connection(mut stream: TcpStream) {
  let mut buffer = [0; 1024];
  stream.read(&mut buffer).unwrap();

  let get = b"GET / HTTP/1.1\r\n";
  let sleep = b"GET /sleep HTTP/1.1\r\n";

  if buffer.starts_with(get) {
    send_response(stream, "HTTP/1.1 200 OK", "server/index.html");
  } else if buffer.starts_with(sleep) {
    thread::sleep(Duration::from_secs(5));
    send_response(stream, "HTTP/1.1 200 OK", "server/index.html");
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
