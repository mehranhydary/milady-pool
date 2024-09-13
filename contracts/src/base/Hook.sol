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
            uint256 inputAmount,
            uint256 outputAmount,
            address tokenInput,
            address token0,
            address token1,
            uint24 fee,
            int24 tickSpacing,
            address hooks,
            bytes memory permit2Signature,
            uint256 permit2Nonce,
            uint256 permit2Deadline
        ) = (
                _publicValues.walletAddress,
                _publicValues.tickToSellAt,
                _publicValues.zeroForOne,
                _publicValues.inputAmount,
                _publicValues.outputAmount,
                _publicValues.tokenInput,
                _publicValues.token0,
                _publicValues.token1,
                _publicValues.fee,
                _publicValues.tickSpacing,
                _publicValues.hooks,
                _publicValues.permit2Signature,
                _publicValues.permit2Nonce,
                _publicValues.permit2Deadline
            );

        // TODO: Refactor this section; not gonna work because
        // you have to activate the permit 2 signature
        // Look here: https://blog.uniswap.org/permit2-integration-guide

        // Use Permit2 to transfer tokens from the user to this contract
        ISignatureTransfer.PermitTransferFrom memory permit = ISignatureTransfer
            .PermitTransferFrom({
                permitted: ISignatureTransfer.TokenPermissions({
                    token: tokenInput,
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
        // TODO: Instead of passing back toBeforeSwapDelta(0, 0), pass back the token in and out amounts
        // for the new swap function

        // Which means...

        // BalanceDelta delta = poolManager.swap(
        //     key,
        //     IPoolManager.SwapParams({
        //         zeroForOne: zeroForOne,
        //         // TODO: Come back to this because  you might need to cast it and add a negative (check logic)
        //         amountSpecified: tokenInput == token0
        //             ? zeroForOne
        //                 ? int256(inputAmount)
        //                 : -int256(inputAmount)
        //             : zeroForOne
        //                 ? int256(outputAmount)
        //                 : -int256(outputAmount),
        //         sqrtPriceLimitX96: zeroForOne
        //             ? TickMath.MIN_SQRT_PRICE + 1
        //             : TickMath.MAX_SQRT_PRICE - 1
        //     }),
        //     ""
        // );

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

        // Return the appropriate values
        // TODO: Need to update toBeforeSwapDelta to handle token in and out amounts
        return (this.beforeSwap.selector, toBeforeSwapDelta(0, 0), 0);
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
