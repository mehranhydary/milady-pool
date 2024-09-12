// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import {IHooks} from "v4-core/interfaces/IHooks.sol";

struct PublicValuesStruct {
    address walletAddress;
    int24 tickToSellAt;
    bool zeroForOne;
    uint256 inputAmount;
    uint256 outputAmount;
    address tokenInput;
    address token0;
    address token1;
    uint24 fee;
    int24 tickSpacing;
    address hooks; // Should be passed into IHooks interface
    bytes32 permit2Signature;
}
