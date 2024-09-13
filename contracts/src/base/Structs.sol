// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import {IHooks} from "v4-core/interfaces/IHooks.sol";

struct PublicValuesStruct {
    address walletAddress;
    // Swap params (but we will use this in the before swap delta fn)
    bytes permit2Signature;
    uint256 permit2Nonce;
    uint256 permit2Deadline;
}

struct Sig {
    uint8 v;
    bytes32 r;
    bytes32 s;
}
