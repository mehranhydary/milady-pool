// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

interface IMiladyPoolTaskManager {
    // Need events
    event OrderCreated(uint32 indexed orderId, Order order);
    // TODO: Figure out if we need a correpsonding order id
    // or a zkp or both
    event OrderFulfilled(
        uint32 indexed orderId,
        uint32 indexed matchingOrderId
    );
    event OrderCancelled(uint32 indexed orderId);
    // TODO: Add events for challenges (successful and unsuccessful)
    // Need structs
    struct Order {
        uint32 orderId;
    }
    // TODO: Figure out what other structs you need here (look at Arena X, Uniswap X, etc.)
    // Need functions
    function createOrder(
        Order calldata order
    ) external payable returns (uint32);
    function cancelOrder(uint32 orderId) external;
    // TODO: Look at Uniswap X and Arena X for inspiration
}
