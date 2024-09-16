// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
// Uniswap V4 Core
import {IHooks} from "v4-core/interfaces/IHooks.sol";
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

// MiladyPool
import "../src/MiladyPoolServiceMAnager.sol" as miladyPoolServiceManager;
import {MiladyPoolOrderManager} from "../src/MiladyPoolOrderManager.sol";
import {PublicValuesStruct} from "../src/base/Structs.sol";

// Eigenlyer
import {BLSMockAVSDeployer} from "@eigenlayer-middleware/test/utils/BLSMockAVSDeployer.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract MiladyPoolOrderManagerTest is BLSMockAVSDeployer, Deployers {
    miladyPoolServiceManager.MiladyPoolServiceManager sm;
    miladyPoolServiceManager.MiladyPoolServiceManager smImplementation;

    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    MiladyPoolOrderManager hook;
    MiladyPoolOrderManager hookImplementation;

    ISignatureTransfer permit2;

    address aggregator =
        address(uint160(uint256(keccak256(abi.encodePacked("aggregator")))));
    address generator =
        address(uint160(uint256(keccak256(abi.encodePacked("generator")))));

    function setUp() public {
        _setUpBLSMockAVSDeployer();

        permit2 = ISignatureTransfer(
            0x000000000022D473030F116dDEE9F6B43aC78BA3
        );
        deployFreshManagerAndRouters();

        (currency0, currency1) = deployMintAndApprove2Currencies();

        address hookAddress = address(
            uint160(
                Hooks.AFTER_INITIALIZE_FLAG |
                    Hooks.BEFORE_SWAP_FLAG |
                    Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG |
                    Hooks.AFTER_SWAP_FLAG
            )
        );
        deployCodeTo(
            "MiladyPoolOrderManager.sol",
            abi.encode(address(0), manager),
            hookAddress
        );

        hookImplementation = new MiladyPoolOrderManager(
            miladyPoolServiceManager.IRegistryCoordinator(
                address(registryCoordinator)
            ),
            manager
        );

        hook = MiladyPoolOrderManager(
            address(
                new TransparentUpgradeableProxy(
                    address(hookImplementation),
                    address(proxyAdmin),
                    abi.encodeWithSelector(
                        hook.initialize.selector,
                        pauserRegistry,
                        registryCoordinatorOwner,
                        aggregator,
                        generator
                    )
                )
            )
        );

        // hook = MiladyPoolOrderManager(hookAddress);

        // (key, ) = initPool(
        //     currency0,
        //     currency1,
        //     hook,
        //     3000,
        //     SQRT_PRICE_1_1,
        //     ZERO_BYTES
        // );

        // IERC20Minimal(Currency.unwrap(key.currency0)).approve(
        //     hookAddress,
        //     1000 ether
        // );
        // IERC20Minimal(Currency.unwrap(key.currency1)).approve(
        //     hookAddress,
        //     1000 ether
        // );

        // modifyLiquidityRouter.modifyLiquidity(
        //     key,
        //     IPoolManager.ModifyLiquidityParams({
        //         tickLower: -60,
        //         tickUpper: 60,
        //         liquidityDelta: 10 ether,
        //         salt: bytes32(0)
        //     }),
        //     ZERO_BYTES
        // );
        // modifyLiquidityRouter.modifyLiquidity(
        //     key,
        //     IPoolManager.ModifyLiquidityParams({
        //         tickLower: -120,
        //         tickUpper: 120,
        //         liquidityDelta: 10 ether,
        //         salt: bytes32(0)
        //     }),
        //     ZERO_BYTES
        // );
        // // some liquidity for full range
        // modifyLiquidityRouter.modifyLiquidity(
        //     key,
        //     IPoolManager.ModifyLiquidityParams({
        //         tickLower: TickMath.minUsableTick(60),
        //         tickUpper: TickMath.maxUsableTick(60),
        //         liquidityDelta: 10 ether,
        //         salt: bytes32(0)
        //     }),
        //     ZERO_BYTES
        // );
    }

    /**
      1. Get permit2 signature for the trade you want to do
      2. Take the permit2 details and create an order
      3. Take the order and create a hash
      4. Sign the hash  and store it somewhere
      5. Call swap with the order details, hash, etc. 
      6. See how it goes down!
   */

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

    function test__createOffchainOrderDetails() public {
        address trader = address(1);
        vm.prank(trader);
        uint256 nonce = 0; // TODO: Figure out how to generate nonces for permit2 (can I use permit2...?)
        PublicValuesStruct memory publicValues = PublicValuesStruct({
            walletAddress: trader,
            permit2Signature: abi.encodePacked(permit2),
            permit2Nonce: nonce,
            permit2Deadline: 0
        });
    }
}
