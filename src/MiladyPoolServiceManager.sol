// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "./interfaces/IMiladyPoolTaskManager.sol";
import "@eigenlayer/contracts/libraries/BytesLib.sol";
import "@eigenlayer-middleware/src/ServiceManagerBase.sol";

contract MiladyPoolServiceManager is ServiceManagerBase {
    using BytesLib for bytes;

    IMiladyPoolTaskManager public miladyPoolTaskManager;

    modifier onlyMiladyPoolTaskManager() {
        require(
            msg.sender == address(miladyPoolTaskManager),
            "MiladyPoolServiceManager: Only MiladyPoolTaskManager can call this function"
        );
        _;
    }

    constructor(
        IAVSDirectory _avsDirectory,
        IRegistryCoordinator _registryCoordinator,
        IStakeRegistry _stakeRegistry,
        IMiladyPoolTaskManager _miladyPoolTaskManager
    ) ServiceManagerBase(_avsDirectory, _registryCoordinator, _stakeRegistry) {
        miladyPoolTaskManager = _miladyPoolTaskManager;
    }
}
