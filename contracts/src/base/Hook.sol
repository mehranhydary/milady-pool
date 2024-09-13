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
import {WyvernInspired} from "./WyvernInspired.sol";
import {PublicValuesStruct, Sig} from "./Structs.sol";
import {ISignatureTransfer} from "permit2/src/interfaces/ISignatureTransfer.sol";
import {FixedPoint96} from "v4-core/libraries/FixedPoint96.sol";
import {FullMath} from "v4-core/libraries/FullMath.sol";

abstract contract Hook is BaseHook, WyvernInspired {
    using StateLibrary for IPoolManager;
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    // TODO: Hardcoded for now, should update so that we pass it in
    address constant PERMIT2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    // TODO: Figure out if we need latest order id, order hashes, zkps, matching order ids, responses, challenges, etc.
    mapping(PoolId poolId => int24 lastTick) public lastTicks;
    mapping(bytes => bool) public pendingOrders;

    // Errors
    error InvalidOrder();
    error NothingToClaim();
    error NotEnoughToClaim();

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}

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

    function _afterInitialize(
        PoolKey calldata key,
        int24 tick
    ) internal returns (int24) {
        lastTicks[key.toId()] = tick;
        return tick;
    }

    function _beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        bytes calldata data
    ) internal returns (bytes4, BeforeSwapDelta, uint24) {
        (bytes memory publicValues, bytes memory sig) = abi.decode(
            data,
            (bytes, bytes)
        );

        PublicValuesStruct memory _publicValues = abi.decode(
            publicValues,
            (PublicValuesStruct)
        );

        Sig memory _sig = abi.decode(sig, (Sig));

        bytes32 hash = _hashOrder(_publicValues);

        if (!_validateOrder(hash, _publicValues, _sig)) {
            revert InvalidOrder();
        }

        // Validate the pool key
        // Validate the outputs of the proof

        (
            address walletAddress,
            int24 tickToSellAt,
            bool zeroForOne,
            int256 amountSpecified,
            bytes memory permit2Signature,
            uint256 permit2Nonce,
            uint256 permit2Deadline
        ) = (
                _publicValues.walletAddress,
                _publicValues.tickToSellAt,
                _publicValues.zeroForOne,
                _publicValues.amountSpecified,
                _publicValues.permit2Signature,
                _publicValues.permit2Nonce,
                _publicValues.permit2Deadline
            );

        // TODO: FIGURE OUT AMOUNT IN AND OUT BASED ON INFO LAID OUT IN THE STRUCT

        // TODO: Refactor this section; not gonna work because
        // you have to activate the permit 2 signature
        // Look here: https://blog.uniswap.org/permit2-integration-guide

        // Use Permit2 to transfer tokens from the user to this contract
        uint256 inputAmount = amountSpecified > 0
            ? uint256(amountSpecified)
            : _calculateAmountIn(
                uint256(-amountSpecified),
                tickToSellAt,
                key.tickSpacing,
                zeroForOne
                    ? Currency.unwrap(key.currency0)
                    : Currency.unwrap(key.currency1),
                zeroForOne
                    ? Currency.unwrap(key.currency1)
                    : Currency.unwrap(key.currency0),
                key.fee
            );
        ISignatureTransfer.PermitTransferFrom memory permit = ISignatureTransfer
            .PermitTransferFrom({
                permitted: ISignatureTransfer.TokenPermissions({
                    token: zeroForOne
                        ? Currency.unwrap(key.currency0)
                        : Currency.unwrap(key.currency1),
                    amount: inputAmount
                }),
                nonce: permit2Nonce,
                deadline: permit2Deadline
            });

        ISignatureTransfer.SignatureTransferDetails
            memory transferDetails = ISignatureTransfer
                .SignatureTransferDetails({
                    to: address(this),
                    requestedAmount: inputAmount
                });

        // Assuming PERMIT2 is a constant address of the Permit2 contract
        ISignatureTransfer(PERMIT2).permitTransferFrom(
            permit,
            transferDetails,
            walletAddress,
            permit2Signature
        );

        uint256 outputAmount = amountSpecified > 0
            ? _calculateAmountOut(
                uint256(amountSpecified),
                tickToSellAt,
                key.tickSpacing,
                zeroForOne
                    ? Currency.unwrap(key.currency0)
                    : Currency.unwrap(key.currency1),
                zeroForOne
                    ? Currency.unwrap(key.currency1)
                    : Currency.unwrap(key.currency0),
                key.fee
            )
            : uint256(-amountSpecified);

        // TODO: Need to update toBeforeSwapDelta to handle token in and out amounts
        BeforeSwapDelta beforeSwapDelta;

        // Calculate the amount out based on the given data

        if (zeroForOne) {
            beforeSwapDelta = toBeforeSwapDelta(-int128(amountSpecified), 0);
        } else {
            beforeSwapDelta = toBeforeSwapDelta(int128(amountSpecified), 0);
        }

        // Return the appropriate values
        return (this.beforeSwap.selector, beforeSwapDelta, 0);
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

    function _calculateAmountOut(
        uint256 amountIn,
        int24 tickToSellAt,
        int24 tickSpacing,
        address tokenIn,
        address tokenOut,
        uint24 fee
    ) internal pure returns (uint256 amountOut) {
        uint160 sqrtPriceX96 = TickMath.getSqrtPriceAtTick(tickToSellAt);
        uint256 priceX96 = FullMath.mulDiv(
            sqrtPriceX96,
            sqrtPriceX96,
            FixedPoint96.Q96
        );

        // Calculate the amount out before fees
        if (tokenIn < tokenOut) {
            // token0 to token1
            amountOut = FullMath.mulDiv(amountIn, priceX96, FixedPoint96.Q96);
        } else {
            // token1 to token0
            amountOut = FullMath.mulDiv(amountIn, FixedPoint96.Q96, priceX96);
        }

        // Apply the fee
        uint256 feeAmount = FullMath.mulDiv(amountOut, fee, 1e6);
        amountOut -= feeAmount;
    }

    function _calculateAmountIn(
        uint256 amountOut,
        int24 tickToSellAt,
        int24 tickSpacing,
        address tokenIn,
        address tokenOut,
        uint24 fee
    ) internal pure returns (uint256 amountIn) {
        uint160 sqrtPriceX96 = TickMath.getSqrtPriceAtTick(tickToSellAt);
        uint256 priceX96 = FullMath.mulDiv(
            sqrtPriceX96,
            sqrtPriceX96,
            FixedPoint96.Q96
        );

        // Calculate the amount in before fees
        if (tokenIn < tokenOut) {
            // token0 to token1
            amountIn = FullMath.mulDiv(amountOut, FixedPoint96.Q96, priceX96);
        } else {
            // token1 to token0
            amountIn = FullMath.mulDiv(amountOut, priceX96, FixedPoint96.Q96);
        }

        // Apply the fee
        uint256 feeAmount = FullMath.mulDiv(amountIn, fee, 1e6);
        amountIn += feeAmount;
    }
}
