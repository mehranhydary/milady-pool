// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

interface IMiladyPoolTaskManager {
    // Need events
    event OrderCreated(bytes proofBytes);
    // TODO: Figure out if we need a correpsonding order id
    // or a zkp or both
    // TODO: Figure out if you want to add more details for the trade here
    event OrderFulfilled(bytes proofBytes);

    event TickUpdated(int24 tick);

    event OrderCancelled(bytes proofBytes);
    // TODO: Add events for challenges (successful and unsuccessful)

    // TODO: Figure out what other structs you need here (look at Arena X, Uniswap X, etc.)
    // Need functions
    function createOrder(bytes calldata proofBytes) external;
    function cancelOrder(bytes calldata proofBytes) external;
    // TODO: Look at Uniswap X and Arena X for inspiration
}
