// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import "forge-std/console.sol";
import "forge-std/console2.sol";
import {Vm} from "forge-std/Vm.sol";

// Uniswap V4 Core

import {Hooks} from "v4-core/libraries/Hooks.sol";
import {TickMath} from "v4-core/libraries/TickMath.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {CurrencyLibrary, Currency} from "v4-core/types/Currency.sol";
import {PoolSwapTest} from "v4-core/test/PoolSwapTest.sol";
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

import {MiladyPoolDeployer} from "./utils/MiladyPoolDeployer.sol";

contract MiladyPoolOrderManagerTest is MiladyPoolDeployer, Deployers {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    ISignatureTransfer PERMIT2;

    Currency token0;
    Currency token1;

    address constant CREATE2_DEPLOYER =
        address(0x4e59b44847b379578588920cA78FbF26c0B4956C);

    bytes32 public constant TOKEN_PERMISSIONS_TYPEHASH =
        keccak256("TokenPermissions(address token,uint256 amount)");

    bytes32 public constant PERMIT_TRANSFER_FROM_TYPEHASH =
        keccak256(
            "PermitTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
        );

    function setUp() public {
        // Permit2 Setup

        PERMIT2 = ISignatureTransfer(
            0x000000000022D473030F116dDEE9F6B43aC78BA3
        );

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
                liquidityDelta: 10 ether,
                salt: bytes32(0)
            }),
            ZERO_BYTES
        );
        modifyLiquidityRouter.modifyLiquidity(
            key,
            IPoolManager.ModifyLiquidityParams({
                tickLower: -120,
                tickUpper: 120,
                liquidityDelta: 10 ether,
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
                liquidityDelta: 10 ether,
                salt: bytes32(0)
            }),
            ZERO_BYTES
        );
    }

    function test__createOffchainOrderDetails() public {
        address trader = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        uint256 totalAmount = type(uint256).max;

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
            PERMIT2.DOMAIN_SEPARATOR()
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            // Need to pass in a pk (generic one from Anvil / Foundry)
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            msgHash
        );

        PublicValuesStruct memory order = PublicValuesStruct({
            walletAddress: trader,
            permit2Signature: abi.encode(v, r, s),
            permit2Nonce: 0,
            permit2Deadline: block.timestamp + 1 days
        });

        bytes32 hashToSign = miladyPoolOrderManager.hashToSign(order);
        require(hashToSign != bytes32(0), "Hash is zero");
        vm.stopPrank();
    }

    function test__useOffchainOrderDetailsToSwap() public {
        address trader = address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        uint256 totalAmount = type(uint256).max;

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
            PERMIT2.DOMAIN_SEPARATOR()
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            // Need to pass in a pk (generic one from Anvil / Foundry)
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            msgHash
        );

        PublicValuesStruct memory order = PublicValuesStruct({
            walletAddress: trader,
            permit2Signature: abi.encode(v, r, s),
            permit2Nonce: 0,
            permit2Deadline: block.timestamp + 1 days
        });

        bytes32 hashToSign = miladyPoolOrderManager.hashToSign(order);
        (uint8 v_, bytes32 r_, bytes32 s_) = vm.sign(
            0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            hashToSign
        );

        bytes memory encodedSignature = abi.encode(v_, r_, s_);

        PoolKey memory poolKey = PoolKey(
            token0,
            token1,
            3000,
            int24((3000 / 100) * 2),
            hooksUseable
        );
        IPoolManager.SwapParams memory swapParams = IPoolManager.SwapParams({
            zeroForOne: true,
            amountSpecified: 100,
            sqrtPriceLimitX96: SQRT_PRICE_1_1
        });
        POOL_MANAGER.swap(key, swapParams, encodedSignature);
    }

    function _getTransferDetails(
        address to,
        uint256 amount
    )
        private
        pure
        returns (ISignatureTransfer.SignatureTransferDetails memory)
    {
        return
            ISignatureTransfer.SignatureTransferDetails({
                to: to,
                requestedAmount: amount
            });
    }

    function _getTokenPermissions(
        address token,
        uint256 amount
    ) internal returns (ISignatureTransfer.TokenPermissions memory) {
        return
            ISignatureTransfer.TokenPermissions({token: token, amount: amount});
    }

    function _getPermitTransferFrom(
        ISignatureTransfer.TokenPermissions memory permitted,
        uint256 nonce,
        uint256 deadline
    ) internal returns (ISignatureTransfer.PermitTransferFrom memory) {
        return
            ISignatureTransfer.PermitTransferFrom({
                permitted: permitted,
                nonce: nonce,
                deadline: deadline
            });
    }

    function _getPermitTransferMsgHash(
        ISignatureTransfer.PermitTransferFrom memory permit,
        bytes32 domainSeparator
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
                        address(this),
                        permit.nonce,
                        permit.deadline
                    )
                )
            )
        );
    }
}
