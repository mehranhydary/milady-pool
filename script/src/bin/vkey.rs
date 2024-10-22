//! Script to print the program verification key
//! You can run this script using 
//! ```
//!  RUST_LOG=info cargo run --bin vkey --release
//! ```

use sp1_sdk::{HashableKey, ProverClient};

/// The ELF (executable and linkable format) file for Succint RISC-V zkVM
/// 
/// The file is generated by running `cargo provde build` inside the `program` directory
pub const MILADY_POOL_ELF: &[u8] = include_bytes!("../../../elf/riscv32im-succinct-zkvm-elf");

fn main () {
  // Setup the logger 
  sp1_sdk::utils::setup_logger();

  let client = ProverClient::new();

  let(_, vk) = client.setup(MILADY_POOL_ELF);

  println!("Program Verification Key: {}", vk.bytes32());
}