// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LuteMaker1 {

    address immutable public user;
    bool public hairGiven;

    constructor(address _user) {
        user = _user;
    }

    function giveHarpyHair(bytes32 _hair) external {
        require(msg.sender == user, "Not authorized");
        require(
            _hair == keccak256(abi.encodePacked("Harpy hair for:", user)),
            "Wrong hairs, are you sure it's from a harpy?"
        );

        hairGiven = true;
    }

}
