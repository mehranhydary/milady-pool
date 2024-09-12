// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

// Succinct
import {ISP1Verifier} from "@sp1-contracts/ISP1Verifier.sol";

import {PublicValuesStruct} from "./Structs.sol";

abstract contract Verification {
    address public verifier;
    bytes32 public miladyPoolProgramVKey;

    error VerificationKeyNotInitialized();

    constructor(address _verifier) {
        verifier = _verifier;
    }

    function _setVerifier(address _verifier) internal {
        verifier = _verifier;
    }

    function _setMiladyPoolProgramVKey(
        bytes32 _miladyPoolProgramVKey
    ) internal {
        miladyPoolProgramVKey = _miladyPoolProgramVKey;
    }

    function _verifyMiladyPoolOrderProof(
        bytes memory _publicValues,
        bytes memory _proofBytes
    )
        internal
        view
        returns (
            address,
            int24,
            bool,
            uint256,
            uint256,
            address,
            address,
            address,
            uint24,
            int24,
            address,
            bytes32
        )
    {
        if (miladyPoolProgramVKey == bytes32(0)) {
            revert VerificationKeyNotInitialized();
        }
        ISP1Verifier(verifier).verifyProof(
            miladyPoolProgramVKey,
            _publicValues,
            _proofBytes
        );
        PublicValuesStruct memory publicValues = abi.decode(
            _publicValues,
            (PublicValuesStruct)
        );
        return (
            publicValues.walletAddress,
            publicValues.tickToSellAt,
            publicValues.zeroForOne,
            publicValues.inputAmount,
            publicValues.outputAmount,
            publicValues.tokenInput,
            publicValues.token0,
            publicValues.token1,
            publicValues.fee,
            publicValues.tickSpacing,
            publicValues.hooks,
            publicValues.permit2Signature
        );
    }
}
