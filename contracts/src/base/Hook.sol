// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "forge-std/console.sol";
import "forge-std/console2.sol";

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
import {MiladyPoolMath} from "../libraries/MiladyPoolMath.sol";

abstract contract Hook is BaseHook, WyvernInspired {
    using StateLibrary for IPoolManager;
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    // TODO: Hardcoded for now, should update so that we pass it in
    address constant PERMIT2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    // Handle before swap balance delta and claims with 6909

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

    function _beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata data
    ) internal returns (bytes4, BeforeSwapDelta, uint24) {
        (bytes memory publicValues, bytes memory sig) = abi.decode(
            data,
            (bytes, bytes)
        );

        console.log("Logging public values encoded public values:");
        console.logBytes(publicValues);

        console.log("Logging signature:");
        console.logBytes(sig);

        PublicValuesStruct memory _publicValues = abi.decode(
            publicValues,
            (PublicValuesStruct)
        );

        console.log("Logging wallet address:");
        console.log(_publicValues.walletAddress);

        console.log("Logging permit2 nonce:");
        console.log(_publicValues.permit2Nonce);

        console.log("Logging permit2 deadline:");
        console.log(_publicValues.permit2Deadline);

        Sig memory _sig = abi.decode(sig, (Sig));

        console.log("Logging signature 'v' value:");
        console.log(_sig.v);
        console.log("Logging signature 'r' value:");
        console.logBytes32(_sig.r);
        console.log("Logging signature 's' value:");
        console.logBytes32(_sig.s);

        bytes32 hash = _hashToSign(_publicValues);
        console.log("Hash from decoded data");
        console.logBytes32(hash);

        if (!_validateOrder(hash, _publicValues, _sig)) {
            revert InvalidOrder();
        }

        // Validate the pool key
        // Validate the outputs of the proof

        (
            address walletAddress,
            // This is the trade secret
            bytes memory permit2Signature,
            uint256 permit2Nonce,
            uint256 permit2Deadline
        ) = (
                _publicValues.walletAddress,
                _publicValues.permit2Signature,
                _publicValues.permit2Nonce,
                _publicValues.permit2Deadline
            );

        (uint160 sqrtPriceX96, , , ) = poolManager.getSlot0(key.toId());

        uint128 liquidity = poolManager.getLiquidity(key.toId());

        (
            // TODO: Figure out if this is the beforeSwapDelta we pass back
            // or if it is fine because we are conducting the swap here
            BeforeSwapDelta beforeSwapDelta,
            uint256 amountOut,
            uint256 amountIn,

        ) = _getSwapDeltas(
                sqrtPriceX96,
                liquidity, // TODO: Confirm this is the right one to use
                params.amountSpecified,
                params.zeroForOne
            );

        ISignatureTransfer.PermitTransferFrom memory permit = ISignatureTransfer
            .PermitTransferFrom({
                permitted: ISignatureTransfer.TokenPermissions({
                    token: params.zeroForOne
                        ? Currency.unwrap(key.currency0)
                        : Currency.unwrap(key.currency1),
                    amount: amountIn // NOTE: This is the amount of the token that is swapped in (should confirm that it is the amount specified)
                }),
                nonce: permit2Nonce,
                deadline: permit2Deadline
            });

        ISignatureTransfer.SignatureTransferDetails
            memory transferDetails = ISignatureTransfer
                .SignatureTransferDetails({
                    to: address(this),
                    requestedAmount: amountIn
                });

        ISignatureTransfer(PERMIT2).permitTransferFrom(
            permit,
            transferDetails,
            walletAddress,
            permit2Signature
        );

        _settle(
            params.zeroForOne // Gets the token that is swapped in
                ? Currency(key.currency0)
                : Currency(key.currency1),
            uint128(amountIn)
        );

        // Can skip the entire amount to swap here if we just do the swap here
        // At this point the first token is already in the pool so we need to call _take
        _take(
            params.zeroForOne // Gets the token that is swapped out
                ? Currency(key.currency1)
                : Currency(key.currency0),
            uint128(amountOut),
            walletAddress
        );

        // Return the appropriate values
        return (this.beforeSwap.selector, beforeSwapDelta, 0);
    }

    // TODO: Update so that the PoolKey sqrtPriceCurrentX96, liquidity are what you need
    function _getSwapDeltas(
        uint160 sqrtPriceCurrentX96,
        uint128 liquidity,
        int256 amountSpecified,
        bool zeroForOne
    )
        internal
        view
        returns (
            BeforeSwapDelta beforeSwapDelta,
            uint256 amountOut,
            uint256 amountIn,
            uint160 sqrtPriceX96Next
        )
    {
        if (amountSpecified > 0) {
            amountOut = uint256(amountSpecified);
            if (zeroForOne) {
                (amountIn, , sqrtPriceX96Next) = MiladyPoolMath
                    .getSwapAmountsFromAmount0(
                        sqrtPriceCurrentX96,
                        liquidity,
                        amountOut
                    );
            } else {
                (, amountIn, sqrtPriceX96Next) = MiladyPoolMath
                    .getSwapAmountsFromAmount1(
                        sqrtPriceCurrentX96,
                        liquidity,
                        amountOut
                    );
            }
        } else {
            amountIn = uint256(-amountSpecified);
            if (zeroForOne) {
                (, amountOut, sqrtPriceX96Next) = MiladyPoolMath
                    .getSwapAmountsFromAmount0(
                        sqrtPriceCurrentX96,
                        liquidity,
                        amountIn
                    );
            } else {
                (amountOut, , sqrtPriceX96Next) = MiladyPoolMath
                    .getSwapAmountsFromAmount1(
                        sqrtPriceCurrentX96,
                        liquidity,
                        amountIn
                    );
            }
        }

        beforeSwapDelta = toBeforeSwapDelta(
            int128(uint128(amountIn)), // specified == token0/token1
            -int128(uint128(amountOut)) // unspecified == token1/token0
        );
    }

    function _settle(Currency currency, uint128 amount) internal {
        // Should be used to move the tokens received via permit2 to the pool manager
        poolManager.sync(currency);
        currency.transfer(address(poolManager), amount);
        poolManager.settle();
    }

    function _take(Currency currency, uint128 amount, address trader) internal {
        // Should be used to move the tokens received via permit2 to the pool manager
        poolManager.sync(currency);
        currency.transfer(trader, amount);
    }
}
