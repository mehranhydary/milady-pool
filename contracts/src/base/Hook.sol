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
import {Currency, CurrencyLibrary} from "v4-core/types/Currency.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {Verification} from "./Verification.sol";

abstract contract Hook is BaseHook, Verification {
    using StateLibrary for IPoolManager;
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    // TODO: Figure out if we need latest order id, order hashes, zkps, matching order ids, responses, challenges, etc.
    mapping(PoolId poolId => int24 lastTick) public lastTicks;
    mapping(bytes => bool) public pendingOrders;

    // Errors
    error InvalidOrder();
    error NothingToClaim();
    error NotEnoughToClaim();

    constructor(
        IPoolManager _poolManager,
        // SP1 contracts to verify public values
        address _verifier
    ) BaseHook(_poolManager) Verification(_verifier) {}

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

    function _beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        bytes calldata data
    ) internal returns (bytes4, BeforeSwapDelta, uint24, bytes memory) {
        (bytes memory publicValues, bytes memory proofBytes) = abi.decode(
            data,
            (bytes, bytes)
        );

        if (!pendingOrders[proofBytes]) {
            revert InvalidOrder();
        }

        (
            // TODO: Probably need some of this...
            // One is to check the direction of the trade
            // Another is to call this with permit2 instead
            // of the way we are doing it now (which has no
            // actual assets lmao)
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
        ) = _verifyMiladyPoolOrderProof(publicValues, proofBytes);

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

        // Return the appropriate values
        // TODO: Need to update toBeforeSwapDelta to handle token in and out amounts
        return (
            this.beforeSwap.selector,
            toBeforeSwapDelta(0, 0),
            0,
            proofBytes
        );
    }

    function _afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        BalanceDelta,
        bytes calldata
    ) internal returns (int24) {
        (, int24 currentTick, , ) = poolManager.getSlot0(key.toId());
        return currentTick;
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
}
