// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

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

import {MiladyPoolServiceManager, IServiceManager} from "../src/MiladyPoolServiceManager.sol";
import {MiladyPoolTaskManager} from "../src/MiladyPoolTaskManager.sol";
import {IMiladyPoolTaskManager} from "../src/interfaces/IMiladyPoolTaskManager.sol";
// TODO: Figure out why we need an ERC20Mock.sol...
import "../src/ERC20Mock.sol";

import {Utils} from "./utils/Utils.sol";

import "forge-std/Test.sol";
import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import "forge-std/console.sol";

contract MiladyPoolDeployer is Script, Utils {
    // TODO: Constants that we may need should be defined here

    // ERC20 and Strategy: we need to deploy this erc20, create a strategy for it, and whitelist this strategy in the strategymanager
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

    MiladyPoolTaskManager public miladyPoolTaskManager;
    IMiladyPoolTaskManager public miladyPoolTaskManagerImplementation;

    function run() external {
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

        address miladyPoolCommunityMultisig = msg.sender;
        address miladyPoolPauser = msg.sender;

        vm.startBroadcast();
        _deployErc20AndStrategyAndWhitelistStrategy(
            eigenLayerProxyAdmin,
            eigenLayerPauserReg,
            baseStrategyImplementation,
            strategyManager
        );
        _deployMiladyPoolContracts(
            delegationManager,
            avsDirectory,
            erc20MockStrategy,
            miladyPoolCommunityMultisig,
            miladyPoolPauser
        );
        vm.stopBroadcast();
    }

    function _deployErc20AndStrategyAndWhitelistStrategy(
        ProxyAdmin eigenLayerProxyAdmin,
        PauserRegistry eigenLayerPauserReg,
        StrategyBaseTVLLimits baseStrategyImplementation,
        IStrategyManager strategyManager
    ) internal {
        erc20Mock = new ERC20Mock();
        // TODO(samlaf): any reason why we are using the strategybase with tvl limits instead of just using strategybase?
        // the maxPerDeposit and maxDeposits below are just arbitrary values.
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
        IStrategy strat,
        address miladyPoolCommunityMultisig,
        address miladyPoolPauser
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

        miladyPoolTaskManager = MiladyPoolTaskManager(
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
            miladyPoolTaskManager
        );

        miladyPoolProxyAdmin.upgrade(
            TransparentUpgradeableProxy(
                payable(address(miladyPoolServiceManager))
            ),
            address(miladyPoolServiceManagerImplementation)
        );

        // TODO: Initalize this correctly (see variables in MiladyPoolTaskManager)
        miladyPoolTaskManagerImplementation = new MiladyPoolTaskManager(
            registryCoordinator,
            IPoolManager(address(0)), // Should be Uniswap Pool Manager
            address(0) // Should be Verifier
        );

        miladyPoolProxyAdmin.upgradeAndCall(
            TransparentUpgradeableProxy(
                payable(address(miladyPoolTaskManager))
            ),
            address(miladyPoolTaskManagerImplementation),
            abi.encodeWithSelector(
                miladyPoolTaskManager.initialize.selector,
                miladyPoolPauserReg,
                miladyPoolCommunityMultisig
                // TODO: Come back to these two
            )
        );

        // WRITE JSON DATA
        string memory parent_object = "parent object";

        string memory deployed_addresses = "addresses";
        vm.serializeAddress(
            deployed_addresses,
            "erc20Mock",
            address(erc20Mock)
        );
        vm.serializeAddress(
            deployed_addresses,
            "erc20MockStrategy",
            address(erc20MockStrategy)
        );
        vm.serializeAddress(
            deployed_addresses,
            "miladyPoolServiceManager",
            address(miladyPoolServiceManager)
        );
        vm.serializeAddress(
            deployed_addresses,
            "miladyPoolServiceManagerImplementation",
            address(miladyPoolServiceManagerImplementation)
        );
        vm.serializeAddress(
            deployed_addresses,
            "miladyPoolTaskManager",
            address(miladyPoolTaskManager)
        );
        vm.serializeAddress(
            deployed_addresses,
            "miladyPoolTaskManagerImplementation",
            address(miladyPoolTaskManagerImplementation)
        );
        vm.serializeAddress(
            deployed_addresses,
            "registryCoordinator",
            address(registryCoordinator)
        );
        vm.serializeAddress(
            deployed_addresses,
            "registryCoordinatorImplementation",
            address(registryCoordinatorImplementation)
        );
        string memory deployed_addresses_output = vm.serializeAddress(
            deployed_addresses,
            "operatorStateRetriever",
            address(operatorStateRetriever)
        );

        // serialize all the data
        string memory finalJson = vm.serializeString(
            parent_object,
            deployed_addresses,
            deployed_addresses_output
        );

        writeOutput(finalJson, "credible_squaring_avs_deployment_output");
    }
}
