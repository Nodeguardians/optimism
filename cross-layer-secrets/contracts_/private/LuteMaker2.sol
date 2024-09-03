// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LuteMaker2 {

    address immutable public user;
    bool public woodGiven;

    constructor(address _user) {
        user = _user;
    }

    function giveSingingWood(bytes32 _wood) external {
        require(msg.sender == user, "Not authorized");
        require(
            _wood == keccak256(
                abi.encodePacked("Singing wood for:", user)
            ),
            "Wrong wood, it's not singing at all!"
        );

        woodGiven = true;
    }
}
