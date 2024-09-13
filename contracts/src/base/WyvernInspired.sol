// SPDX-License-Identifier: VPL-1.0
pragma solidity ^0.8.26;

import {PublicValuesStruct, Sig} from "./Structs.sol";

// NOTE: Only supporting ECDSA signatures for now
// TODO: Support EIP-1271 and other signature standards
abstract contract WyvernInspired {
    mapping(bytes32 => bool) public cancelledOrFinalized;

    function hashOrder(
        PublicValuesStruct memory _publicValues
    ) public pure returns (bytes32) {
        return _hashOrder(_publicValues);
    }

    function hashToSign(
        PublicValuesStruct memory _publicValues
    ) public pure returns (bytes32) {
        return _hashToSign(_publicValues);
    }

    function validateOrderParameters(
        PublicValuesStruct memory order
    ) public view returns (bool) {
        return _validateOrderParameters(order);
    }

    function validateOrder(
        PublicValuesStruct memory order,
        Sig memory sig
    ) public view returns (bool) {
        bytes32 hash = _hashOrder(order);
        return _validateOrder(hash, order, sig);
    }

    function cancelOrder(
        PublicValuesStruct memory order,
        Sig memory sig
    ) public {
        return _cancelOrder(order, sig);
    }

    function _hashOrder(
        PublicValuesStruct memory _publicValues
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(_publicValues));
    }

    function _hashToSign(
        PublicValuesStruct memory _publicValues
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    _hashOrder(_publicValues)
                )
            );
    }

    function _requireValidOrder(
        PublicValuesStruct memory order,
        Sig memory sig
    ) internal view returns (bytes32) {
        bytes32 hash = _hashToSign(order);
        require(_validateOrder(hash, order, sig));
        return hash;
    }

    // TODO: May not need this for now but nice to have
    function _validateOrderParameters(
        PublicValuesStruct memory order
    ) internal view returns (bool) {
        if (order.walletAddress == address(0)) return false;
        if (order.tickToSellAt == 0) return false;
        if (order.amountSpecified == 0) return false;
        return true;
    }

    function _validateOrder(
        bytes32 hash,
        PublicValuesStruct memory order,
        Sig memory sig
    ) internal view returns (bool) {
        if (!(_validateOrderParameters(order))) {
            return false;
        }

        if (cancelledOrFinalized[hash]) {
            return false;
        }

        if (ecrecover(hash, sig.v, sig.r, sig.s) == order.walletAddress) {
            return true;
        }

        return false;
    }

    function _cancelOrder(
        PublicValuesStruct memory order,
        Sig memory sig
    ) internal {
        bytes32 hash = _requireValidOrder(order, sig);
        require(msg.sender == order.walletAddress, "INVALID_ADDRESS");

        cancelledOrFinalized[hash] = true;

        // TODO: Add event
    }
}
