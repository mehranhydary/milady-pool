//! An e2e example of using sp1 sdk to generate a proof of a program
//! that can have an evm compatible proof generated which can be verified
//! onchain
//! 
//! you can run this script using the following command:
//! ```shell
//! RUST_LOG=info cargo run --release --bin evm
//! ```

use alloy_sol_types::SolType;
use clap::Parser;
use milady_pool_lib::PublicValuesStruct;
use serde::{Deserialize, Serialize};
use sp1_sdk::{HashableKey, ProverClient, SP1ProofWithPublicValues, SP1Stdin, SP1VerifyingKey};
use std::path::PathBuf;

// The ELF file for Succint RISC-V zkVM
pub const MILADY_POOL_ELF: &[u8] = include_bytes!("../../../elf/riscv32im-succinct-zkvm-elf");

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct EVMArgs {
  #[clap(long, default_value = "20")]
  n: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SP1MiladyPoolProofFixture {
  a: u32,
  b: u32,
  n: u32,
  vkey: String,
  public_values: String,
  proof: String,
}

fn main () {
  sp1_sdk::utils::setup_logger();

  let args = EVMArgs::parse();

  let client = ProverClient::new();

  let (pk, vk) = client.setup(MILADY_POOL_ELF);

  let mut stdin = SP1Stdin::new();
  stdin.write(&args.n);

  println!("n: {}", args.n);

  let proof = client.prove(&pk, stdin).plonk().run().expect("Failed to generate proof");
  create_plonk_fixture(&proof, &vk);
}

fn create_plonk_fixture(proof: &SP1ProofWithPublicValues, vk: &SP1VerifyingKey)  {
  let bytes= proof.public_values.as_slice();

  let PublicValuesStruct { n, a, b } = PublicValuesStruct::abi_decode(bytes, false).expect("Failed to decode public values");

  let fixture = SP1MiladyPoolProofFixture {
    a,
    b,
    n,
    vkey: vk.bytes32(),
    public_values: hex::encode(bytes),
    proof: format!("0x{}", hex::encode(proof.bytes())),
  };

  println!("Verification Key: {}", fixture.vkey);

  println!("Public Values: {}", fixture.public_values);

  println!("Proof Bytes: {}", fixture.proof);

  let fixture_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../contracts/src/fixtures");
  std::fs::create_dir_all(&fixture_path).expect("failed to create fixtures directory");
  std::fs::write(
    fixture_path.join("fixture.json"),
    serde_json::to_string_pretty(&fixture).unwrap(),
  ).expect("failed to write fixture file");
}