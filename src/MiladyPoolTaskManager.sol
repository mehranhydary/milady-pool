// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";

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
    BaseHook,
    OwnableUpgradeable,
    Pausable,
    BLSSignatureChecker,
    OperatorStateRetriever,
    IMiladyPoolTaskManager
{
    using BN254 for BN254.G1Point;
    using StateLibrary for IPoolManager;
    using PoolIdLibrary for PoolKey;

    // TODO: Do we need order response / challenge times?
    // uint32 public immutable TASK_RESPONSE_WINDOW_BLOCK;
    // uint32 public constant TASK_CHALLENGE_WINDOW_BLOCK = 100;
    // uint256 internal constant _THRESHOLD_DENOMINATOR = 100;

    // TODO: Figure out if we need latest order id, order hashes, zkps, matching order ids, responses, challenges, etc.

    constructor(
        IRegistryCoordinator _registryCoordinator,
        IPoolManager _poolManager
    ) BLSSignatureChecker(_registryCoordinator) BaseHook(_poolManager) {
        TASK_RESPONSE_WINDOW_BLOCK = 100;
    }

    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return
            Hooks.Permissions({
                beforeInitialize: false,
                afterInitialize: true,
                beforeAddLiquidity: false,
                afterAddLiquidity: false,
                beforeRemoveLiquidity: false,
                afterRemoveLiquidity: false,
                beforeSwap: false,
                afterSwap: true,
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
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
