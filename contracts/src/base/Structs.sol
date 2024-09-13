// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import {IHooks} from "v4-core/interfaces/IHooks.sol";

struct PublicValuesStruct {
    address walletAddress;
    // Swap params (but we will use this in the before swap delta fn)
    int24 tickToSellAt;
    bool zeroForOne; // If true, the trade is initialized with token0 being the input token, and token1 being the output token
    int256 amountSpecified; // The amount of the swap: positive for exact input, negative for exact output
    // zero for one true, amount specified > 0, exact input of token 0 for token 1
    // zero for one true, amount specified < 0, exact output of token 0 for token 1
    // zero for one false, amount specified > 0, exact input of token 1 for token 0
    // zero for one false, amount specified < 0, exact output of token 1 for token 0
    bytes permit2Signature;
    uint256 permit2Nonce;
    uint256 permit2Deadline;
}

struct Sig {
    uint8 v;
    bytes32 r;
    bytes32 s;
}
