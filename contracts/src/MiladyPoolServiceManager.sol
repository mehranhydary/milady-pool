// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import "./interfaces/IMiladyPoolTaskManager.sol";
import "@eigenlayer/contracts/libraries/BytesLib.sol";
import "@eigenlayer-middleware/src/ServiceManagerBase.sol";

contract MiladyPoolServiceManager is ServiceManagerBase {
    using BytesLib for bytes;

    IMiladyPoolTaskManager public miladyPoolTaskManager;

    /// @notice when applied to a function, ensures that the function is only callable by the milady task manager
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

    /// @notice Called in the event of challenge resolution, in order to forward a call to the Slasher, which 'freezes' the `operator`.
    /// @dev The Slasher contract is under active development and its interface expected to change.
    ///      We recommend writing slashing logic without integrating with the Slasher at this point in time.
    function freezeOperator(
        address operatorAddress
    ) external onlyMiladyPoolTaskManager {
        // NOTE: Should be called in the event of a challenge resolutoin in order
        // slasher.freezeOperator(operatorAddress);
    }
}