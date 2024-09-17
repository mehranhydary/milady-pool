// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {PoolManager} from "v4-core/PoolManager.sol";
import {PoolSwapTest} from "v4-core/test/PoolSwapTest.sol";
import {PoolModifyLiquidityTest} from "v4-core/test/PoolModifyLiquidityTest.sol";
import {PoolDonateTest} from "v4-core/test/PoolDonateTest.sol";
import {PoolTakeTest} from "v4-core/test/PoolTakeTest.sol";
import {PoolClaimsTest} from "v4-core/test/PoolClaimsTest.sol";
import {MiladyPoolRouter} from "../src/MiladyPoolRouter.sol";

contract V4Deployer is Script {
    function run() public {
        vm.startBroadcast();

        PoolManager manager = new PoolManager(0);
        PoolSwapTest swapRouter = new PoolSwapTest(manager);
        MiladyPoolRouter _swapRouter = new MiladyPoolRouter(manager);
        PoolModifyLiquidityTest modifyLiquidityRouter = new PoolModifyLiquidityTest(
                manager
            );
        PoolDonateTest donateRouter = new PoolDonateTest(manager);
        PoolTakeTest takeRouter = new PoolTakeTest(manager);
        PoolClaimsTest claimsRouter = new PoolClaimsTest(manager);

        // Anything else you need to do like minting mock ERC20s or initializing a pool
        // you need to do directly here as well without using Deployers

        vm.stopBroadcast();
    }
}
