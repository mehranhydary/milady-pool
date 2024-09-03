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

    // TODO: Do we need order response / challenge times?
    // uint32 public immutable TASK_RESPONSE_WINDOW_BLOCK;
    // uint32 public constant TASK_CHALLENGE_WINDOW_BLOCK = 100;
    // uint256 internal constant _THRESHOLD_DENOMINATOR = 100;

    constructor(
        IRegistryCoordinator _registryCoordinator,
        IPoolManager _poolManager,
        // SP1 contracts to verify public values
        address _verifier
    ) BLSSignatureChecker(_registryCoordinator) Hook(_poolManager, _verifier) {
        // TASK_RESPONSE_WINDOW_BLOCK = 100;
    }

    function initialize(
        IPauserRegistry _pauserRegistry,
        address initialOwner,
        bytes32 _miladyPoolProgramVKey
    ) public initializer {
        _initializePauser(_pauserRegistry, UNPAUSE_ALL);
        _transferOwnership(initialOwner);
        _setMiladyPoolProgramVKey(_miladyPoolProgramVKey);
    }

    function setVerifier(address _verifier) public onlyOwner {
        _setVerifier(_verifier);
    }

    function setMiladyPoolProgramVKey(
        bytes32 _miladyPoolProgramVKey
    ) public onlyOwner {
        _setMiladyPoolProgramVKey(_miladyPoolProgramVKey);
    }

    function createOrder(bytes calldata _proofBytes) external {
        pendingOrders[_proofBytes] = true;
        emit OrderCreated(_proofBytes);
    }

    function cancelOrder(bytes calldata _proofBytes) external {
        if (!pendingOrders[_proofBytes]) revert InvalidOrder();
        pendingOrders[_proofBytes] = false;
        emit OrderCancelled(_proofBytes);
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
            uint24 lpFeeOverride,
            bytes memory proofBytes
        ) = _beforeSwap(sender, key, params, data);
        emit OrderFulfilled(proofBytes);
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
