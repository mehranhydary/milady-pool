// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "forge-std/Test.sol";

// For Eigenlyer
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@eigenlayer/contracts/permissions/PauserRegistry.sol";
import {IDelegationManager} from "@eigenlayer/contracts/interfaces/IDelegationManager.sol";
import {IAVSDirectory} from "@eigenlayer/contracts/interfaces/IAVSDirectory.sol";
import {IStrategyManager, IStrategy} from "@eigenlayer/contracts/interfaces/IStrategyManager.sol";
import {ISlasher} from "@eigenlayer/contracts/interfaces/ISlasher.sol";
import {StrategyBaseTVLLimits} from "@eigenlayer/contracts/strategies/StrategyBaseTVLLimits.sol";
import "@eigenlayer/test/mocks/EmptyContract.sol";
import "@eigenlayer-middleware/src/RegistryCoordinator.sol" as regCoord;
import {IBLSApkRegistry, IIndexRegistry, IStakeRegistry} from "@eigenlayer-middleware/src/RegistryCoordinator.sol";
import {BLSApkRegistry} from "@eigenlayer-middleware/src/BLSApkRegistry.sol";
import {IndexRegistry} from "@eigenlayer-middleware/src/IndexRegistry.sol";
import {StakeRegistry} from "@eigenlayer-middleware/src/StakeRegistry.sol";
import "@eigenlayer-middleware/src/OperatorStateRetriever.sol";
import "../../src/ERC20Mock.sol";

// Milady Pool
import {MiladyPoolServiceManager, IServiceManager} from "../../src/MiladyPoolServiceManager.sol";
import {MiladyPoolOrderManager} from "../../src/MiladyPoolOrderManager.sol";
import {IMiladyPoolOrderManager} from "../../src/interfaces/IMiladyPoolOrderManager.sol";

// Uniswap V4
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {HookMiner} from "../../script/utils/HookMiner.sol";
import {Utils} from "../../script/utils/Utils.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

contract MiladyPoolDeployer is Test, Utils {
    using PoolIdLibrary for PoolKey;
    IPoolManager public POOL_MANAGER;
    ERC20Mock public erc20Mock;
    StrategyBaseTVLLimits public erc20MockStrategy;

    ProxyAdmin public miladyPoolProxyAdmin;
    PauserRegistry public miladyPoolPauserReg;

    regCoord.RegistryCoordinator public registryCoordinator;
    regCoord.IRegistryCoordinator public registryCoordinatorImplementation;

    IBLSApkRegistry public blsApkRegistry;
    IBLSApkRegistry public blsApkRegistryImplementation;

    IIndexRegistry public indexRegistry;
    IIndexRegistry public indexRegistryImplementation;

    IStakeRegistry public stakeRegistry;
    IStakeRegistry public stakeRegistryImplementation;

    OperatorStateRetriever public operatorStateRetriever;

    MiladyPoolServiceManager public miladyPoolServiceManager;
    IServiceManager public miladyPoolServiceManagerImplementation;

    MiladyPoolOrderManager public miladyPoolOrderManager;
    IMiladyPoolOrderManager public miladyPoolOrderManagerImplementation;

    IHooks public hooksUseable;

    address miladyPoolCommunityMultisig =
        0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address miladyPoolPauser = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    function _setUpMiladyPool() internal {
        vm.startPrank(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);

        string memory eigenlayerDeployedContracts = readOutput(
            "eigenlayer_deployment_output"
        );
        IStrategyManager strategyManager = IStrategyManager(
            stdJson.readAddress(
                eigenlayerDeployedContracts,
                ".addresses.strategyManager"
            )
        );
        IDelegationManager delegationManager = IDelegationManager(
            stdJson.readAddress(
                eigenlayerDeployedContracts,
                ".addresses.delegation"
            )
        );
        IAVSDirectory avsDirectory = IAVSDirectory(
            stdJson.readAddress(
                eigenlayerDeployedContracts,
                ".addresses.avsDirectory"
            )
        );
        ProxyAdmin eigenLayerProxyAdmin = ProxyAdmin(
            stdJson.readAddress(
                eigenlayerDeployedContracts,
                ".addresses.eigenLayerProxyAdmin"
            )
        );
        PauserRegistry eigenLayerPauserReg = PauserRegistry(
            stdJson.readAddress(
                eigenlayerDeployedContracts,
                ".addresses.eigenLayerPauserReg"
            )
        );
        StrategyBaseTVLLimits baseStrategyImplementation = StrategyBaseTVLLimits(
                stdJson.readAddress(
                    eigenlayerDeployedContracts,
                    ".addresses.baseStrategyImplementation"
                )
            );

        _deployErc20AndStrategyAndWhitelistStrategy(
            eigenLayerProxyAdmin,
            eigenLayerPauserReg,
            baseStrategyImplementation,
            strategyManager
        );

        _deployMiladyPoolContracts(
            delegationManager,
            avsDirectory,
            erc20MockStrategy
        );

        vm.stopPrank();
    }

    function _deployErc20AndStrategyAndWhitelistStrategy(
        ProxyAdmin eigenLayerProxyAdmin,
        PauserRegistry eigenLayerPauserReg,
        StrategyBaseTVLLimits baseStrategyImplementation,
        IStrategyManager strategyManager
    ) internal {
        erc20Mock = new ERC20Mock();

        erc20MockStrategy = StrategyBaseTVLLimits(
            address(
                new TransparentUpgradeableProxy(
                    address(baseStrategyImplementation),
                    address(eigenLayerProxyAdmin),
                    abi.encodeWithSelector(
                        StrategyBaseTVLLimits.initialize.selector,
                        1 ether, // maxPerDeposit
                        100 ether, // maxDeposits
                        IERC20(erc20Mock),
                        eigenLayerPauserReg
                    )
                )
            )
        );
        IStrategy[] memory strats = new IStrategy[](1);
        strats[0] = erc20MockStrategy;
        bool[] memory thirdPartyTransfersForbiddenValues = new bool[](1);
        thirdPartyTransfersForbiddenValues[0] = false;
        strategyManager.addStrategiesToDepositWhitelist(
            strats,
            thirdPartyTransfersForbiddenValues
        );
    }

    function _deployMiladyPoolContracts(
        IDelegationManager delegationManager,
        IAVSDirectory avsDirectory,
        IStrategy strat
    ) internal {
        IStrategy[1] memory deployedStrategyArray = [strat];
        uint numStrategies = deployedStrategyArray.length;
        miladyPoolProxyAdmin = new ProxyAdmin();

        {
            address[] memory pausers = new address[](2);
            pausers[0] = miladyPoolPauser;
            pausers[1] = miladyPoolCommunityMultisig;
            miladyPoolPauserReg = new PauserRegistry(
                pausers,
                miladyPoolCommunityMultisig
            );
        }

        EmptyContract emptyContract = new EmptyContract();

        miladyPoolServiceManager = MiladyPoolServiceManager(
            address(
                new TransparentUpgradeableProxy(
                    address(emptyContract),
                    address(miladyPoolProxyAdmin),
                    ""
                )
            )
        );

        miladyPoolOrderManager = MiladyPoolOrderManager(
            address(
                new TransparentUpgradeableProxy(
                    address(emptyContract),
                    address(miladyPoolProxyAdmin),
                    ""
                )
            )
        );

        registryCoordinator = regCoord.RegistryCoordinator(
            address(
                new TransparentUpgradeableProxy(
                    address(emptyContract),
                    address(miladyPoolProxyAdmin),
                    ""
                )
            )
        );

        blsApkRegistry = IBLSApkRegistry(
            address(
                new TransparentUpgradeableProxy(
                    address(emptyContract),
                    address(miladyPoolProxyAdmin),
                    ""
                )
            )
        );

        indexRegistry = IIndexRegistry(
            address(
                new TransparentUpgradeableProxy(
                    address(emptyContract),
                    address(miladyPoolProxyAdmin),
                    ""
                )
            )
        );

        stakeRegistry = IStakeRegistry(
            address(
                new TransparentUpgradeableProxy(
                    address(emptyContract),
                    address(miladyPoolProxyAdmin),
                    ""
                )
            )
        );

        operatorStateRetriever = new OperatorStateRetriever();

        // Second, deploy the *implementation* contracts, using the *proxy contracts* as inputs
        {
            stakeRegistryImplementation = new StakeRegistry(
                registryCoordinator,
                delegationManager
            );

            miladyPoolProxyAdmin.upgrade(
                TransparentUpgradeableProxy(payable(address(stakeRegistry))),
                address(stakeRegistryImplementation)
            );

            blsApkRegistryImplementation = new BLSApkRegistry(
                registryCoordinator
            );

            miladyPoolProxyAdmin.upgrade(
                TransparentUpgradeableProxy(payable(address(blsApkRegistry))),
                address(blsApkRegistryImplementation)
            );

            indexRegistryImplementation = new IndexRegistry(
                registryCoordinator
            );

            miladyPoolProxyAdmin.upgrade(
                TransparentUpgradeableProxy(payable(address(indexRegistry))),
                address(indexRegistryImplementation)
            );
        }

        registryCoordinatorImplementation = new regCoord.RegistryCoordinator(
            miladyPoolServiceManager,
            regCoord.IStakeRegistry(address(stakeRegistry)),
            regCoord.IBLSApkRegistry(address(blsApkRegistry)),
            regCoord.IIndexRegistry(address(indexRegistry))
        );

        {
            // For each quorum to setup, we need to define
            // QuorumOperatorSetParam, minimumStakeForQuorum, and strategyParams
            uint numQuorums = 1;

            regCoord.IRegistryCoordinator.OperatorSetParam[]
                memory quorumsOperatorSetParams = new regCoord.IRegistryCoordinator.OperatorSetParam[](
                    numQuorums
                );

            for (uint i = 0; i < numQuorums; i++) {
                quorumsOperatorSetParams[i] = regCoord
                    .IRegistryCoordinator
                    .OperatorSetParam({
                        maxOperatorCount: 10000,
                        kickBIPsOfOperatorStake: 15000,
                        kickBIPsOfTotalStake: 100
                    });
            }

            uint96[] memory quorumsMinimumStake = new uint96[](numQuorums);
            IStakeRegistry.StrategyParams[][]
                memory quorumsStrategyParams = new IStakeRegistry.StrategyParams[][](
                    numQuorums
                );

            for (uint i = 0; i < numQuorums; i++) {
                quorumsStrategyParams[i] = new IStakeRegistry.StrategyParams[](
                    numStrategies
                );
                for (uint j = 0; j < numStrategies; j++) {
                    quorumsStrategyParams[i][j] = IStakeRegistry
                        .StrategyParams({
                            strategy: deployedStrategyArray[j],
                            // setting this to 1 ether since the divisor is also 1 ether
                            // therefore this allows an operator to register with even just 1 token
                            // see https://github.com/Layr-Labs/eigenlayer-middleware/blob/m2-mainnet/src/StakeRegistry.sol#L484
                            //    weight += uint96(sharesAmount * strategyAndMultiplier.multiplier / WEIGHTING_DIVISOR);
                            multiplier: 1 ether
                        });
                }
            }
            miladyPoolProxyAdmin.upgradeAndCall(
                TransparentUpgradeableProxy(
                    payable(address(registryCoordinator))
                ),
                address(registryCoordinatorImplementation),
                abi.encodeWithSelector(
                    regCoord.RegistryCoordinator.initialize.selector,
                    // we set churnApprover and ejector to communityMultisig because we don't need them
                    miladyPoolCommunityMultisig,
                    miladyPoolCommunityMultisig,
                    miladyPoolCommunityMultisig,
                    miladyPoolPauserReg,
                    0, // 0 initialPausedStatus means everything unpaused
                    quorumsOperatorSetParams,
                    quorumsMinimumStake,
                    quorumsStrategyParams
                )
            );
        }

        miladyPoolServiceManagerImplementation = new MiladyPoolServiceManager(
            avsDirectory,
            registryCoordinator,
            stakeRegistry,
            miladyPoolOrderManager
        );

        miladyPoolProxyAdmin.upgrade(
            TransparentUpgradeableProxy(
                payable(address(miladyPoolServiceManager))
            ),
            address(miladyPoolServiceManagerImplementation)
        );

        uint160 flags = uint160(
            Hooks.AFTER_INITIALIZE_FLAG |
                Hooks.BEFORE_SWAP_FLAG |
                Hooks.BEFORE_SWAP_RETURNS_DELTA_FLAG |
                Hooks.AFTER_SWAP_FLAG
        );

        // NOTE: Hook miner has to use vm.prank's address instead of
        // CREATE2_DEPLOYER address because of how Foundry works
        (address hookAddress, bytes32 salt) = HookMiner.find(
            address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266),
            flags,
            type(MiladyPoolOrderManager).creationCode,
            abi.encode(registryCoordinator, POOL_MANAGER)
        );

        miladyPoolOrderManagerImplementation = new MiladyPoolOrderManager{
            salt: salt
        }(registryCoordinator, POOL_MANAGER);

        miladyPoolProxyAdmin.upgradeAndCall(
            TransparentUpgradeableProxy(
                payable(address(miladyPoolOrderManager))
            ),
            address(miladyPoolOrderManagerImplementation),
            abi.encodeWithSelector(
                miladyPoolOrderManager.initialize.selector,
                miladyPoolPauserReg,
                miladyPoolCommunityMultisig
            )
        );
        hooksUseable = IHooks(hookAddress);
    }
}
