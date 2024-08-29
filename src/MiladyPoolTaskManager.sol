// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "@openzeppelin-upgrades/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin-upgrades/contracts/access/OwnableUpgradeable.sol";
import "@eigenlayer/contracts/permissions/Pausable.sol";
import "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {BLSApkRegistry} from "@eigenlayer-middleware/src/BLSApkRegistry.sol";
import {RegistryCoordinator} from "@eigenlayer-middleware/src/RegistryCoordinator.sol";
import {BLSSignatureChecker, IRegistryCoordinator} from "@eigenlayer-middleware/src/BLSSignatureChecker.sol";
import {OperatorStateRetriever} from "@eigenlayer-middleware/src/OperatorStateRetriever.sol";
import "@eigenlayer-middleware/src/libraries/BN254.sol";
import "./interfaces/IMiladyPoolTaskManager.sol";

contract MiladyPoolTaskManager is
    OwnableUpgradeable,
    Pausable,
    BLSSignatureChecker,
    OperatorStateRetriever,
    IMiladyPoolTaskManager
{
    using BN254 for BN254.G1Point;

    // TODO: Do we need order response / challenge times?
    // uint32 public immutable TASK_RESPONSE_WINDOW_BLOCK;
    // uint32 public constant TASK_CHALLENGE_WINDOW_BLOCK = 100;
    // uint256 internal constant _THRESHOLD_DENOMINATOR = 100;

    // TODO: Figure out if we need latest order id, order hashes, zkps, matching order ids, responses, challenges, etc.

    constructor(
        IRegistryCoordinator _registryCoordinator
    ) BLSSignatureChecker(_registryCoordinator) {
        TASK_RESPONSE_WINDOW_BLOCK = 100;
    }

    function initialize(
        IPauserRegistry _pauserRegistry,
        address initialOwner
    ) public initializer {
        _initializePauser(_pauserRegistry, UNPAUSE_ALL);
        _transferOwnership(initialOwner);
    }

    function createNewOrder(Order calldata order) external payable {
        // TODO: Figure out what the actual order will be
        Order calldata order = Order({orderId: 1});

        // TODO: Update the global state variables (order ids, hashes, etc.)
    }

    function cancelOrder(uint32 orderId) external {}
}
