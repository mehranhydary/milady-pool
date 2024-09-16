// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

interface IMiladyPoolOrderManager {
    event OrderCreated(bytes proofBytes);
    event OrderFulfilled(bytes proofBytes);
    event PriceUpdated(uint160 currentSqrtPriceX96);
    event OrderCancelled(bytes proofBytes);
}
