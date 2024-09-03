// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

// Uniswap
import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {StateLibrary} from "v4-core/libraries/StateLibrary.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "v4-core/types/BeforeSwapDelta.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {Currency, CurrencyLibrary} from "v4-core/types/Currency.sol";

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

// Succinct
import {ISP1Verifier} from "@sp1-contracts/ISP1Verifier.sol";

// Custom:
import "./interfaces/IMiladyPoolTaskManager.sol";
import {PublicValuesStruct} from "./base/Structs.sol";

// TODO: Need to add ERC6909 or ERC1155 to ensure that
// users can withdraw their tokens after a trade takes place
// through the pool and their verified proof is accepted.
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
    using CurrencyLibrary for Currency;

    // TODO: Do we need order response / challenge times?
    // uint32 public immutable TASK_RESPONSE_WINDOW_BLOCK;
    // uint32 public constant TASK_CHALLENGE_WINDOW_BLOCK = 100;
    // uint256 internal constant _THRESHOLD_DENOMINATOR = 100;

    // TODO: Figure out if we need latest order id, order hashes, zkps, matching order ids, responses, challenges, etc.
    mapping(PoolId poolId => int24 lastTick) public lastTicks;
    mapping(bytes => bool) public pendingOrders;
    address public verifier;
    bytes32 public miladyPoolProgramVKey;

    // Errors
    error InvalidOrder();
    error NothingToClaim();
    error NotEnoughToClaim();

    constructor(
        IRegistryCoordinator _registryCoordinator,
        IPoolManager _poolManager,
        // SP1 contracts to verify public values
        address _verifier
    ) BLSSignatureChecker(_registryCoordinator) BaseHook(_poolManager) {
        // TASK_RESPONSE_WINDOW_BLOCK = 100;
        verifier = _verifier;
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
                beforeSwap: true,
                afterSwap: true,
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: true,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    function afterInitialize(
        address,
        PoolKey calldata key,
        uint160,
        int24 tick,
        bytes calldata
    ) external override onlyByPoolManager returns (bytes4) {
        lastTicks[key.toId()] = tick;
        return this.afterInitialize.selector;
    }

    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        bytes calldata data
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        if (data.length == 0)
            return (this.beforeSwap.selector, toBeforeSwapDelta(0, 0), 0);

        (bytes memory publicValues, bytes memory proofBytes) = abi.decode(
            data,
            (bytes, bytes)
        );

        (
            address walletAddress,
            int24 tickToSellAt,
            bool zeroForOne,
            uint256 inputAmount,
            uint256 outputAmount,
            address tokenInput,
            address token0,
            address token1,
            uint24 fee,
            int24 tickSpacing,
            address hooks,
            bytes32 permit2Signature
        ) = verifiyMiladyPoolOrderProof(publicValues, proofBytes);

        // Validate the pool key
        // Validate the outputs of the proof

        // TODO: Refactor this section; not gonna work because
        // you have to activate the permit 2 signature
        BalanceDelta delta = poolManager.swap(
            key,
            IPoolManager.SwapParams({
                zeroForOne: zeroForOne,
                // TODO: Come back to this because  you might need to cast it and add a negative (check logic)
                amountSpecified: tokenInput == token0
                    ? zeroForOne
                        ? int256(inputAmount)
                        : -int256(inputAmount)
                    : zeroForOne
                        ? int256(outputAmount)
                        : -int256(outputAmount),
                sqrtPriceLimitX96: zeroForOne
                    ? TickMath.MIN_SQRT_PRICE + 1
                    : TickMath.MAX_SQRT_PRICE - 1
            }),
            // TODO: Figure out if you want to handle this here again too lmao (permit2signature)
            ""
        );

        if (zeroForOne) {
            if (delta.amount0() < 0) {
                _settle(key.currency0, uint128(-delta.amount0()));
            }

            if (delta.amount1() > 0) {
                _take(key.currency1, uint128(-delta.amount1()));
            }
        } else {
            if (delta.amount0() > 0) {
                _take(key.currency0, uint128(-delta.amount0()));
            }

            if (delta.amount1() < 0) {
                _settle(key.currency1, uint128(-delta.amount1()));
            }
        }

        pendingOrders[proofBytes] = false;
        emit OrderFulfilled(proofBytes);

        // Return the appropriate values
        // TODO: Need to update toBeforeSwapDelta to handle token in and out amounts
        return (this.beforeSwap.selector, toBeforeSwapDelta(0, 0), 0);
    }

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta,
        bytes calldata
    ) external override onlyByPoolManager returns (bytes4, int128) {
        if (sender == address(this)) return (this.afterSwap.selector, 0);
        (, int24 currentTick, , ) = poolManager.getSlot0(key.toId());

        emit TickUpdated(currentTick);

        return (this.afterSwap.selector, 0);
    }

    function initialize(
        IPauserRegistry _pauserRegistry,
        address initialOwner,
        bytes32 _miladyPoolProgramVKey
    ) public initializer {
        _initializePauser(_pauserRegistry, UNPAUSE_ALL);
        _transferOwnership(initialOwner);
        miladyPoolProgramVKey = _miladyPoolProgramVKey;
    }

    function setVerifier(address _verifier) public onlyOwner {
        verifier = _verifier;
    }

    function setMiladyPoolProgramVKey(
        bytes32 _miladyPoolProgramVKey
    ) public onlyOwner {
        miladyPoolProgramVKey = _miladyPoolProgramVKey;
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

    function _settle(Currency currency, uint128 amount) internal {
        // Transfer tokens to PM and let it know
        poolManager.sync(currency);
        currency.transfer(address(poolManager), amount);
        poolManager.settle();
    }

    function _take(Currency currency, uint128 amount) internal {
        // Take tokens out of PM to our hook contract
        poolManager.take(currency, address(this), amount);
    }

    // TODO: Swap function will be called with some data to swap
    function verifiyMiladyPoolOrderProof(
        bytes memory _publicValues,
        bytes memory _proofBytes
    )
        public
        view
        returns (
            address,
            int24,
            bool,
            uint256,
            uint256,
            address,
            address,
            address,
            uint24,
            int24,
            address,
            bytes32
        )
    {
        require(
            miladyPoolProgramVKey != bytes32(0),
            "Verification key not initialized"
        );
        ISP1Verifier(verifier).verifyProof(
            miladyPoolProgramVKey,
            _publicValues,
            _proofBytes
        );
        PublicValuesStruct memory publicValues = abi.decode(
            _publicValues,
            (PublicValuesStruct)
        );
        return (
            publicValues.walletAddress,
            publicValues.tickToSellAt,
            publicValues.zeroForOne,
            publicValues.inputAmount,
            publicValues.outputAmount,
            publicValues.tokenInput,
            publicValues.token0,
            publicValues.token1,
            publicValues.fee,
            publicValues.tickSpacing,
            publicValues.hooks,
            publicValues.permit2Signature
        );
    }
}
