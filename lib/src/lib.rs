use alloy_sol_types::sol;

sol! {
  struct PublicValuesStruct {
    uint32 n;
    uint32 a;
    uint32 b;
  }
}

// Add other functions here 
pub fn fibonacci(n: u32) -> (u32, u32) {
  let mut a = 0u32;
  let mut b = 1u32;
  for _ in 0..n {
      let c = a.wrapping_add(b);
      a = b;
      b = c;
  }
  (a, b)
}