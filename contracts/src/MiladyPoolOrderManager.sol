// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

// Uniswap
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "v4-core/types/BeforeSwapDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {StateLibrary} from "v4-core/libraries/StateLibrary.sol";
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
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {MiladyPoolMath} from "./libraries/MiladyPoolMath.sol";

// Custom:
import "./interfaces/IMiladyPoolOrderManager.sol";
import {Hook} from "./base/Hook.sol";

// TODO: Need to add ERC6909 or ERC1155 to ensure that
// users can withdraw their tokens after a trade takes place
// through the pool and their verified proof is accepted.
contract MiladyPoolOrderManager is
    OwnableUpgradeable,
    Pausable,
    BLSSignatureChecker,
    OperatorStateRetriever,
    IMiladyPoolOrderManager,
    Hook
{
    using BN254 for BN254.G1Point;
    using PoolIdLibrary for PoolKey;
    using StateLibrary for IPoolManager;

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
        emit PriceUpdated(TickMath.getSqrtPriceAtTick(tick));
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
            // TODO: Figure out what this is (not needed for now)
            uint24 lpFeeOverride
        ) = _beforeSwap(sender, key, params, data);
        // TODO: Come back to this to emit an event
        // emit OrderFulfilled(proofBytes);
        return (selector, delta, lpFeeOverride);
    }

    function afterSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        BalanceDelta,
        bytes calldata
    ) external override onlyByPoolManager returns (bytes4, int128) {
        (, int24 currentTick, , ) = poolManager.getSlot0(key.toId());
        emit PriceUpdated(TickMath.getSqrtPriceAtTick(currentTick));
        return (this.afterSwap.selector, 0);
    }
}
