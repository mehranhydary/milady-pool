// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "forge-std/Test.sol";

// Uniswap V4 Core

import {Hooks} from "v4-core/libraries/Hooks.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {CurrencyLibrary, Currency} from "v4-core/types/Currency.sol";
import {Deployers} from "@uniswap/v4-core/test/utils/Deployers.sol";
import {IERC20Minimal} from "v4-core/interfaces/external/IERC20Minimal.sol";

// Permit2
import {ISignatureTransfer} from "permit2/src/interfaces/ISignatureTransfer.sol";
import {IAllowanceTransfer} from "permit2/src/interfaces/IAllowanceTransfer.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

// MiladyPool
import {MiladyPoolOrderManager} from "../src/MiladyPoolOrderManager.sol";
import {PublicValuesStruct} from "../src/base/Structs.sol";
import {IMiladyPoolOrderManager} from "../src/interfaces/IMiladyPoolOrderManager.sol";
import {MiladyPoolRouter} from "../src/MiladyPoolRouter.sol";

import {MiladyPoolDeployer} from "./utils/MiladyPoolDeployer.sol";

contract MiladyPoolOrderManagerTest is MiladyPoolDeployer, Deployers {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    ISignatureTransfer public constant PERMIT2 =
        ISignatureTransfer(0x000000000022D473030F116dDEE9F6B43aC78BA3);

    Currency token0;
    Currency token1;

    bytes32 public constant TOKEN_PERMISSIONS_TYPEHASH =
        keccak256("TokenPermissions(address token,uint256 amount)");

    bytes32 public constant PERMIT_TRANSFER_FROM_TYPEHASH =
        keccak256(
            "PermitTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
        );

    function setUp() public {
        // Uniswap V4 Setup
        deployFreshManagerAndRouters();

        POOL_MANAGER = manager;

        // Mock Tokens Setup
        (token0, token1) = deployMintAndApprove2Currencies();

        _setUpMiladyPool();

        (key, ) = initPool(
            token0,
            token1,
            hooksUseable,
            3000,
            SQRT_PRICE_1_1,
            ZERO_BYTES
        );

        IERC20Minimal(Currency.unwrap(key.currency0)).approve(
            address(hooksUseable),
            1000 ether
        );

        IERC20Minimal(Currency.unwrap(key.currency1)).approve(
            address(hooksUseable),
            1000 ether
        );

        modifyLiquidityRouter.modifyLiquidity(
            key,
            IPoolManager.ModifyLiquidityParams({
                tickLower: -60,
                tickUpper: 60,
                liquidityDelta: 1000 ether,
                salt: bytes32(0)
            }),
            ZERO_BYTES
        );
        modifyLiquidityRouter.modifyLiquidity(
            key,
            IPoolManager.ModifyLiquidityParams({
                tickLower: -120,
                tickUpper: 120,
                liquidityDelta: 1000 ether,
                salt: bytes32(0)
            }),
            ZERO_BYTES
        );
        // some liquidity for full range
        modifyLiquidityRouter.modifyLiquidity(
            key,
            IPoolManager.ModifyLiquidityParams({
                tickLower: TickMath.minUsableTick(60),
                tickUpper: TickMath.maxUsableTick(60),
                liquidityDelta: 1000 ether,
                salt: bytes32(0)
            }),
            ZERO_BYTES
        );
    }

    // Exact input of token 0 for token 1 (zeroForOne, amountSpecfied > 0)
    function test__useOffchainOrderDetailsToSwap() public {
        address trader = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        uint256 totalAmount = type(uint256).max;

        // Move some tokens into trader wallet
        deal(Currency.unwrap(token0), trader, 1000 * 10 ** 18);
        deal(Currency.unwrap(token1), trader, 1000 * 10 ** 18);

        vm.startPrank(trader);
        // Approve tokens for PERMIT2
        IERC20Minimal(Currency.unwrap(token0)).approve(
            address(PERMIT2),
            totalAmount
        );

        IERC20Minimal(Currency.unwrap(token1)).approve(
            address(PERMIT2),
            totalAmount
        );

        // Swap amount: 100 * 10e18 tokens
        uint256 swapAmount = 100 * 10 ** 18;

        MiladyPoolRouter _swapRouter = new MiladyPoolRouter(manager);

        ISignatureTransfer.TokenPermissions
            memory permittedToken0 = _getTokenPermissions(
                Currency.unwrap(token0),
                swapAmount
            );

        ISignatureTransfer.PermitTransferFrom
            memory permit = _getPermitTransferFrom(
                permittedToken0,
                0,
                block.timestamp + 1 days
            );

        bytes32 msgHash = _getPermitTransferMsgHash(
            permit,
            PERMIT2.DOMAIN_SEPARATOR(),
            address(_swapRouter)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            // Need to pass in a pk (generic one from Anvil / Foundry)
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            msgHash
        );

        bytes memory permit2Sig = bytes.concat(r, s, bytes1(v));

        PublicValuesStruct memory order = PublicValuesStruct({
            walletAddress: trader,
            permit2Signature: permit2Sig,
            permit2Nonce: 0,
            permit2Deadline: block.timestamp + 1 days
        });

        bytes32 hashToSign = _swapRouter.hashToSign(order);
        (uint8 v_, bytes32 r_, bytes32 s_) = vm.sign(
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            hashToSign
        );

        bytes memory encodedPublicValues = abi.encode(order);
        bytes memory encodedSignature = abi.encode(v_, r_, s_);
        bytes memory swapData = abi.encode(
            encodedPublicValues,
            encodedSignature
        );

        PoolKey memory poolKey = PoolKey(
            token0,
            token1,
            3000,
            int24((3000 / 100) * 2),
            hooksUseable
        );

        // Supporting exact input, zero for one
        IPoolManager.SwapParams memory swapParams = IPoolManager.SwapParams({
            zeroForOne: Currency.unwrap(token0) < Currency.unwrap(token1)
                ? true
                : false,
            amountSpecified: -100 * 10 ** 18,
            sqrtPriceLimitX96: TickMath.MIN_SQRT_PRICE + 1
        });

        // Assuming the initial balances were set and stored in variables `initialToken0Balance` and `initialToken1Balance`
        uint256 initialToken0Balance = IERC20Minimal(Currency.unwrap(token0))
            .balanceOf(trader);
        uint256 initialToken1Balance = IERC20Minimal(Currency.unwrap(token1))
            .balanceOf(trader);

        _swapRouter.swap(key, swapParams, swapData);

        // Assert the token balances after the swap
        uint256 token0BalanceAfter = IERC20Minimal(Currency.unwrap(token0))
            .balanceOf(trader);
        uint256 token1BalanceAfter = IERC20Minimal(Currency.unwrap(token1))
            .balanceOf(trader);

        // Assuming the initial balances were set and stored in variables `initialToken0Balance` and `initialToken1Balance`
        assert(token0BalanceAfter < initialToken0Balance);
        assert(token1BalanceAfter > initialToken1Balance);
        vm.stopPrank();
    }

    // Exact input of token 1 for token 1 (!zeroForOne, amountSpecfied > 0)
    function test__useOffchainOrderDetailsToSwapOneForZero() public {
        address trader = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        uint256 totalAmount = type(uint256).max;

        // Move some tokens into trader wallet
        deal(Currency.unwrap(token0), trader, 1000 * 10 ** 18);
        deal(Currency.unwrap(token1), trader, 1000 * 10 ** 18);

        vm.startPrank(trader);
        // Approve tokens for PERMIT2
        IERC20Minimal(Currency.unwrap(token0)).approve(
            address(PERMIT2),
            totalAmount
        );

        IERC20Minimal(Currency.unwrap(token1)).approve(
            address(PERMIT2),
            totalAmount
        );

        // Swap amount: 100 * 10e18 tokens
        uint256 swapAmount = 100 * 10 ** 18;

        MiladyPoolRouter _swapRouter = new MiladyPoolRouter(manager);

        ISignatureTransfer.TokenPermissions
            memory permittedToken1 = _getTokenPermissions(
                Currency.unwrap(token1),
                swapAmount
            );

        ISignatureTransfer.PermitTransferFrom
            memory permit = _getPermitTransferFrom(
                permittedToken1,
                1,
                block.timestamp + 1 days
            );

        bytes32 msgHash = _getPermitTransferMsgHash(
            permit,
            PERMIT2.DOMAIN_SEPARATOR(),
            address(_swapRouter)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            // Need to pass in a pk (generic one from Anvil / Foundry)
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            msgHash
        );

        bytes memory permit2Sig = bytes.concat(r, s, bytes1(v));

        PublicValuesStruct memory order = PublicValuesStruct({
            walletAddress: trader,
            permit2Signature: permit2Sig,
            permit2Nonce: 1,
            permit2Deadline: block.timestamp + 1 days
        });

        bytes32 hashToSign = _swapRouter.hashToSign(order);
        (uint8 v_, bytes32 r_, bytes32 s_) = vm.sign(
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            hashToSign
        );

        bytes memory encodedPublicValues = abi.encode(order);
        bytes memory encodedSignature = abi.encode(v_, r_, s_);
        bytes memory swapData = abi.encode(
            encodedPublicValues,
            encodedSignature
        );

        PoolKey memory poolKey = PoolKey(
            token0,
            token1,
            3000,
            int24((3000 / 100) * 2),
            hooksUseable
        );

        // Supporting exact input, zero for one
        IPoolManager.SwapParams memory swapParams = IPoolManager.SwapParams({
            zeroForOne: Currency.unwrap(token0) > Currency.unwrap(token1)
                ? true
                : false,
            amountSpecified: -100 * 10 ** 18,
            sqrtPriceLimitX96: TickMath.MAX_SQRT_PRICE - 1
        });

        // Assuming the initial balances were set and stored in variables `initialToken0Balance` and `initialToken1Balance`
        uint256 initialToken0Balance = IERC20Minimal(Currency.unwrap(token0))
            .balanceOf(trader);
        uint256 initialToken1Balance = IERC20Minimal(Currency.unwrap(token1))
            .balanceOf(trader);

        _swapRouter.swap(key, swapParams, swapData);

        // Assert the token balances after the swap
        uint256 token0BalanceAfter = IERC20Minimal(Currency.unwrap(token0))
            .balanceOf(trader);
        uint256 token1BalanceAfter = IERC20Minimal(Currency.unwrap(token1))
            .balanceOf(trader);

        // Assuming the initial balances were set and stored in variables `initialToken0Balance` and `initialToken1Balance`
        assert(token0BalanceAfter > initialToken0Balance);
        assert(token1BalanceAfter < initialToken1Balance);
        vm.stopPrank();
    }

    function _getTokenPermissions(
        address token,
        uint256 amount
    ) internal pure returns (ISignatureTransfer.TokenPermissions memory) {
        return
            ISignatureTransfer.TokenPermissions({token: token, amount: amount});
    }

    function _getPermitTransferFrom(
        ISignatureTransfer.TokenPermissions memory permitted,
        uint256 nonce,
        uint256 deadline
    ) internal pure returns (ISignatureTransfer.PermitTransferFrom memory) {
        return
            ISignatureTransfer.PermitTransferFrom({
                permitted: permitted,
                nonce: nonce,
                deadline: deadline
            });
    }

    function _getPermitTransferMsgHash(
        ISignatureTransfer.PermitTransferFrom memory permit,
        bytes32 domainSeparator,
        address verifyingContract
    ) internal view returns (bytes32 msgHash) {
        bytes32 tokenPermissions = keccak256(
            abi.encode(TOKEN_PERMISSIONS_TYPEHASH, permit.permitted)
        );

        msgHash = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainSeparator,
                keccak256(
                    abi.encode(
                        PERMIT_TRANSFER_FROM_TYPEHASH,
                        tokenPermissions,
                        // NOTE: should be the verifying contract (i.e. the spender)
                        verifyingContract,
                        permit.nonce,
                        permit.deadline
                    )
                )
            )
        );
    }
}
