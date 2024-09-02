// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {StateLibrary} from "v4-core/libraries/StateLibrary.sol";

import "@openzeppelin-upgrades/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin-upgrades/contracts/access/OwnableUpgradeable.sol";
import "@eigenlayer/contracts/permissions/Pausable.sol";
import "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {BLSApkRegistry} from "@eigenlayer-middleware/src/BLSApkRegistry.sol";
import {RegistryCoordinator} from "@eigenlayer-middleware/src/RegistryCoordinator.sol";
import {BLSSignatureChecker, IRegistryCoordinator} from "@eigenlayer-middleware/src/BLSSignatureChecker.sol";
import {OperatorStateRetriever} from "@eigenlayer-middleware/src/OperatorStateRetriever.sol";
import "@eigenlayer-middleware/src/libraries/BN254.sol";

// Custom:
import "./interfaces/IMiladyPoolTaskManager.sol";
import {PublicValuesStruct} from "./base/Structs.sol";

contract MiladyPoolTaskManager is
    BaseHook,
    OwnableUpgradeable,
    Pausable,
    BLSSignatureChecker,
    OperatorStateRetriever,
    IMiladyPoolTaskManager
{
    using BN254 for BN254.G1Point;
    using StateLibrary for IPoolManager;
    using PoolIdLibrary for PoolKey;

    // TODO: Do we need order response / challenge times?
    // uint32 public immutable TASK_RESPONSE_WINDOW_BLOCK;
    // uint32 public constant TASK_CHALLENGE_WINDOW_BLOCK = 100;
    // uint256 internal constant _THRESHOLD_DENOMINATOR = 100;

    // TODO: Figure out if we need latest order id, order hashes, zkps, matching order ids, responses, challenges, etc.
    address public verifier;
    bytes32 public miladyPoolProgramVKey;

    constructor(
        IRegistryCoordinator _registryCoordinator,
        IPoolManager _poolManager,
        // SP1 contracts to verify public values
        address _verifier
    ) BLSSignatureChecker(_registryCoordinator) BaseHook(_poolManager) {
        // TASK_RESPONSE_WINDOW_BLOCK = 100;
        verifier = _verifier;
    }

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
                beforeSwap: false,
                afterSwap: true,
                beforeDonate: false,
                afterDonate: false,
                beforeSwapReturnDelta: false,
                afterSwapReturnDelta: false,
                afterAddLiquidityReturnDelta: false,
                afterRemoveLiquidityReturnDelta: false
            });
    }

    function initialize(
        IPauserRegistry _pauserRegistry,
        address initialOwner,
        bytes32 _miladyPoolProgramVKey
    ) public initializer {
        _initializePauser(_pauserRegistry, UNPAUSE_ALL);
        _transferOwnership(initialOwner);
    }

    function verifiyMiladyPoolOrderProof(
        bytes calldata _publicValues,
        bytes calldata _proofBytes
    )
        public
        view
        returns (
            // TODO: Fix the return type
            bool
        )
    {
        require(
            miladyPoolProgramVKey != bytes32(0),
            "Verification key not initialized"
        );
        ISP1Verifier(verifier).verifyProof(
            miladyPoolProgramVKey,
            _publicValues,
            _proofBytes
        );
        PublicValuesStruct memory publicValues = abi.decode(
            _publicValues,
            (PublicValuesStruct)
        );
        // TODO: Fix the return type
        return true;
    }
}