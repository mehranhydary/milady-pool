// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

// Uniswap
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "v4-core/types/BeforeSwapDelta.sol";

// Eigenlayer
import "@openzeppelin-upgrades/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin-upgrades/contracts/access/OwnableUpgradeable.sol";
import "@eigenlayer/contracts/permissions/Pausable.sol";
import "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {BLSApkRegistry} from "@eigenlayer-middleware/src/BLSApkRegistry.sol";
import {RegistryCoordinator} from "@eigenlayer-middleware/src/RegistryCoordinator.sol";
import {BLSSignatureChecker, IRegistryCoordinator} from "@eigenlayer-middleware/src/BLSSignatureChecker.sol";
import {OperatorStateRetriever} from "@eigenlayer-middleware/src/OperatorStateRetriever.sol";
import "@eigenlayer-middleware/src/libraries/BN254.sol";

// Custom:
import "./interfaces/IMiladyPoolTaskManager.sol";
import {Hook} from "./base/Hook.sol";

// TODO: Need to add ERC6909 or ERC1155 to ensure that
// users can withdraw their tokens after a trade takes place
// through the pool and their verified proof is accepted.
contract MiladyPoolTaskManager is
    OwnableUpgradeable,
    Pausable,
    BLSSignatureChecker,
    OperatorStateRetriever,
    IMiladyPoolTaskManager,
    Hook
{
    using BN254 for BN254.G1Point;

    constructor(
        IRegistryCoordinator _registryCoordinator,
        IPoolManager _poolManager
    ) BLSSignatureChecker(_registryCoordinator) Hook(_poolManager) {}

    function initialize(
        IPauserRegistry _pauserRegistry,
        address initialOwner
    ) public initializer {
        _initializePauser(_pauserRegistry, UNPAUSE_ALL);
        _transferOwnership(initialOwner);
    }

    function afterInitialize(
        address,
        PoolKey calldata key,
        uint160,
        int24 tick,
        bytes calldata
    ) external override onlyByPoolManager returns (bytes4) {
        _afterInitialize(key, tick);
        emit TickUpdated(tick);
        return this.afterInitialize.selector;
    }

    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata data
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        if (data.length == 0)
            return (this.beforeSwap.selector, toBeforeSwapDelta(0, 0), 0);
        (
            bytes4 selector,
            BeforeSwapDelta delta,
            // TODO: Figure out what this is
            uint24 lpFeeOverride
        ) = _beforeSwap(sender, key, params, data);
        // TODO: Come back to this to emit an event
        // emit OrderFulfilled(proofBytes);
        return (selector, delta, lpFeeOverride);
    }

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata data
    ) external override onlyByPoolManager returns (bytes4, int128) {
        if (sender == address(this)) return (this.afterSwap.selector, 0);
        int24 currentTick = _afterSwap(sender, key, params, delta, data);
        emit TickUpdated(currentTick);
        return (this.afterSwap.selector, 0);
    }

    function getLowerUsableTick(
        int24 tick,
        int24 tickSpacing
    ) public pure returns (int24) {
        int24 intervals = tick / tickSpacing;

        if (tick < 0 && tick % tickSpacing != 0) {
            intervals--;
        }

        return intervals * tickSpacing;
    }
}
