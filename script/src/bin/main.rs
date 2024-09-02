//! An e2e example of using sp1 sdk to create a proof of a program that can be executed 
//! or hae a core proof generated
//! 
//! you can ru nthe script by using the following command:
//! ```shell
//!  RUST_LOG=info cargo run --release -- --execute 
//! ```
//! ```shell
//! RUST_LOG=info cargo run --release -- --prove
//! ```

use alloy_sol_types::SolType;
use clap::Parser;
use milady_pool_lib::PublicValuesStruct;
use sp1_sdk::{ProverClient, SP1Stdin};

pub const MILADY_POOL_ELF: &[u8] = include_bytes!("../../../elf/riscv32im-succinct-zkvm-elf");

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
  #[clap(long)]
  execute: bool,

  #[clap(long)]
  prove: bool,

  #[clap(long, default_value = "20")]
  n: u32,
}

fn main() {
  sp1_sdk::utils::setup_logger();

  let args = Args::parse();

  if args.execute == args.prove {
    eprintln!("Error: You must specify either --execute or --prove");
    std::process::exit(1);
  }

  let client = ProverClient::new();

  let mut stdin = SP1Stdin::new();
  stdin.write(&args.n);

  if args.execute {
    let (output, report) = client.execute(MILADY_POOL_ELF, stdin).run().unwrap();
    println!("Program executed successfully");

    let decoded = PublicValuesStruct::abi_decode(output.as_slice(), true).unwrap();
    let PublicValuesStruct { n, a, b } = decoded;
    println!("n: {}, a: {}, b: {}", n, a, b);

    let (expected_a, expected_b) = milady_pool_lib::fibonacci(n);
    assert_eq!(a, expected_a);
    assert_eq!(b, expected_b);
    println!("Output matches expected values");

    println!("Number of cycles: {}", report.total_instruction_count());

  } else {
    let (pk, vk) = client.setup(MILADY_POOL_ELF);

    let proof = client.prove(&pk, stdin).plonk().run().expect("Failed to generate proof");

    println!("Successfully generated proof!");

    client.verify(&proof, &vk).expect("Failed to verify proof");

    println!("Successfully verified proof!");
  }
}