//! A simple program that takes a number n as input, writes the n - 1 th and n th fibonacci 
//! numbers as an output

// These two lines are necessary for program to properly compile
// Under the hood, we wrap your main fucntion with some extra code so it behaves prperly
// in the zkVM environment

#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::SolType;
use milady_pool_lib::{
  // What does your lib do?
  fibonacci,
  PublicValuesStruct
};

pub fn main() {
    // Read an input to the program.
    //
    // Behind the scenes, this compiles down to a custom system call which handles reading inputs
    // from the prover.
    let n = sp1_zkvm::io::read::<u32>();

    // Compute the n'th fibonacci number using a function from the workspace lib crate.
    let (a, b) = fibonacci(n);

    // Encode the public values of the program.
    let bytes = PublicValuesStruct::abi_encode(&PublicValuesStruct { n, a, b });

    // Commit to the public values of the program. The final proof will have a commitment to all the
    // bytes that were committed to.
    sp1_zkvm::io::commit_slice(&bytes);
}