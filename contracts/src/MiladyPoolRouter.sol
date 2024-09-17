// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "forge-std/console.sol";
import "forge-std/console2.sol";

import {Hooks} from "v4-core/libraries/Hooks.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {StateLibrary} from "v4-core/libraries/StateLibrary.sol";
import {TransientStateLibrary} from "v4-core/libraries/TransientStateLibrary.sol";
import {CurrencyLibrary, Currency} from "v4-core/types/Currency.sol";
import {CurrencySettler} from "@uniswap/v4-core/test/utils/CurrencySettler.sol";

import {MiladyPoolMath} from "./libraries/MiladyPoolMath.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, toBeforeSwapDelta} from "v4-core/types/BeforeSwapDelta.sol";
import {PublicValuesStruct, Sig} from "./base/Structs.sol";
import {WyvernInspired} from "./base/WyvernInspired.sol";
import {ISignatureTransfer} from "permit2/src/interfaces/ISignatureTransfer.sol";

contract MiladyPoolRouter is WyvernInspired {
    using StateLibrary for IPoolManager;
    using TransientStateLibrary for IPoolManager;
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using CurrencySettler for Currency;

    // TODO: Hardcoded for now, should update so that we pass it in
    address constant PERMIT2 = 0x000000000022D473030F116dDEE9F6B43aC78BA3;

    struct CallbackData {
        address sender;
        PoolKey key;
        IPoolManager.SwapParams params;
        bytes hookData;
    }

    error InvalidOrder();

    IPoolManager public immutable manager;

    constructor(IPoolManager _manager) {
        manager = _manager;
    }

    function swap(
        PoolKey memory key,
        IPoolManager.SwapParams memory params,
        bytes memory hookData
    ) external payable returns (BalanceDelta delta) {
        delta = abi.decode(
            manager.unlock(
                abi.encode(
                    CallbackData(
                        msg.sender,
                        key,
                        IPoolManager.SwapParams({
                            zeroForOne: params.zeroForOne,
                            amountSpecified: params.amountSpecified,
                            sqrtPriceLimitX96: params.sqrtPriceLimitX96
                        }),
                        hookData
                    )
                )
            ),
            (BalanceDelta)
        );

        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0)
            CurrencyLibrary.NATIVE.transfer(msg.sender, ethBalance);
    }

    function unlockCallback(
        bytes calldata rawData
    ) external returns (bytes memory) {
        require(msg.sender == address(manager));
        CallbackData memory data = abi.decode(rawData, (CallbackData));

        (bytes memory publicValues, bytes memory sig) = abi.decode(
            data.hookData,
            (bytes, bytes)
        );

        PublicValuesStruct memory _publicValues = abi.decode(
            publicValues,
            (PublicValuesStruct)
        );

        Sig memory _sig = abi.decode(sig, (Sig));

        bytes32 hash = _hashToSign(_publicValues);

        if (!_validateOrder(hash, _publicValues, _sig)) {
            revert InvalidOrder();
        }

        (
            address walletAddress,
            bytes memory permit2Signature,
            uint256 permit2Nonce,
            uint256 permit2Deadline
        ) = (
                _publicValues.walletAddress,
                _publicValues.permit2Signature,
                _publicValues.permit2Nonce,
                _publicValues.permit2Deadline
            );

        (uint160 sqrtPriceX96, , , ) = manager.getSlot0(data.key.toId());

        uint128 liquidity = manager.getLiquidity(data.key.toId());

        (
            // TODO: Figure out if this is the beforeSwapDelta we pass back
            // or if it is fine because we are conducting the swap here
            BeforeSwapDelta beforeSwapDelta,
            uint256 amountOut,
            uint256 amountIn,

        ) = _getSwapDeltas(
                sqrtPriceX96,
                liquidity,
                data.params.amountSpecified,
                data.params.zeroForOne
            );

        ISignatureTransfer.PermitTransferFrom memory permit = ISignatureTransfer
            .PermitTransferFrom({
                permitted: ISignatureTransfer.TokenPermissions({
                    token: data.params.zeroForOne
                        ? Currency.unwrap(data.key.currency0)
                        : Currency.unwrap(data.key.currency1),
                    amount: amountIn // NOTE: This is the amount of the token that is swapped in (should confirm that it is the amount specified)
                    // amount: 100 * 10 ** 18
                }),
                nonce: permit2Nonce,
                deadline: permit2Deadline
            });

        ISignatureTransfer.SignatureTransferDetails
            memory transferDetails = ISignatureTransfer
                .SignatureTransferDetails({
                    to: address(this),
                    // requestedAmount: 100 * 10 ** 18
                    requestedAmount: amountIn
                });

        ISignatureTransfer(PERMIT2).permitTransferFrom(
            permit,
            transferDetails,
            walletAddress,
            permit2Signature
        );

        console.log("amountIn: %d", amountIn);
        console.log("amountOut: %d", amountOut);
        console.log("zeroForOne: %s", data.params.zeroForOne);

        // Call this with new data params
        BalanceDelta delta = manager.swap(data.key, data.params, "");
        int256 deltaAfter0 = delta.amount0();
        int256 deltaAfter1 = delta.amount1();
        // _settle(
        //     data.params.zeroForOne // Gets the token that is swapped in
        //         ? Currency(data.key.currency0)
        //         : Currency(data.key.currency1),
        //     uint128(delta.amount0())
        // );

        // // Can skip the entire amount to swap here if we just do the swap here
        // // At this point the first token is already in the pool so we need to call _take
        // _take(
        //     data.params.zeroForOne // Gets the token that is swapped out
        //         ? Currency(data.key.currency1)
        //         : Currency(data.key.currency0),
        //     uint128(delta.amount1()),
        //     walletAddress
        // );

        // if (deltaAfter0 < 0) {
        //     data.key.currency0.settle(
        //         manager,
        //         walletAddress,
        //         uint256(-deltaAfter0),
        //         true
        //     );
        // }
        // if (deltaAfter1 < 0) {
        //     data.key.currency1.settle(
        //         manager,
        //         walletAddress,
        //         uint256(-deltaAfter1),
        //         true
        //     );
        // }
        if (deltaAfter0 > 0) {
            data.key.currency0.take(
                manager,
                walletAddress,
                uint256(deltaAfter0),
                false
            );
        }
        if (deltaAfter1 > 0) {
            data.key.currency1.take(
                manager,
                walletAddress,
                uint256(deltaAfter1),
                false
            );
        }

        return abi.encode(delta);

        // return abi.encode(toBeforeSwapDelta(0, 0));
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
        console.log("sqrtPriceCurrentX96: %d", sqrtPriceCurrentX96);
        console.log("liquidity: %d", liquidity);
        console.log("amountSpecified: %d", amountSpecified);
        console.log("zeroForOne: %s", zeroForOne);
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

        // // Since we are handling the swap in our hook instead of going through the hook's native swap feature
        // // we inverted the swap delta (should be positive, negative otherwise)
        beforeSwapDelta = toBeforeSwapDelta(
            -int128(uint128(amountIn)), // specified == token0/token1
            int128(uint128(amountOut)) // unspecified == token1/token0
        );
    }

    function _settle(Currency currency, uint128 amount) internal {
        // Should be used to move the tokens received via permit2 to the pool manager
        manager.sync(currency);
        currency.transfer(address(manager), amount);
        manager.settle();
    }

    function _take(Currency currency, uint128 amount, address trader) internal {
        manager.take(currency, trader, amount);
    }
}
