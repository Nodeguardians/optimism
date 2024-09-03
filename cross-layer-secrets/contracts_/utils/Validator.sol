// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@node-guardians/ng-quests-contracts/IValidator.sol";
import "../private/LuteMaker1.sol";
import "../private/LuteMaker2.sol";
import "./L1CoastalMaps.sol";

contract Validator is IValidator {

    L1CoastalMaps public l1CoastalMaps;
    uint256 public tokenId = 1;

    mapping(address => LuteMaker1) public luteMakers1;
    mapping(address => LuteMaker2) public luteMakers2;

    constructor() {
        l1CoastalMaps = new L1CoastalMaps();
    }

    function deploy(uint256 k) public override {
        require(k == 1 || k == 2, "Not in scope of quest");

        if (k == 1) {
            l1CoastalMaps.mint(msg.sender, tokenId);
            luteMakers1[msg.sender] = new LuteMaker1(msg.sender);

            tokenId += 1;
        } else {
            luteMakers2[msg.sender] = new LuteMaker2(msg.sender);
        }
    }

    function deployments(address user, uint k) external view returns (address) {
        require(k == 1 || k == 2, "Not in scope of quest");

        if (k == 1) {
            return address(luteMakers1[user]);
        } else {
            return address(luteMakers2[user]);
        }
    }

    function test(address user, uint256 k) public view override returns (bool) {
        require(k == 1 || k == 2, "Not in scope of quest");

        if (k == 1) {
            if (luteMakers1[user] == LuteMaker1(address(0))) {
                return false;
            }

            return luteMakers1[user].hairGiven();
        } else {
            if (luteMakers2[user] == LuteMaker2(address(0))) {
                return false;
            }
            return luteMakers2[user].woodGiven();
        }
    }

    function contractName(uint256 k) external pure returns (string memory) {

        if (k == 1) {
            return "Lute Maker 1";
        } else if (k == 2) {
            return "Lute Maker 2";
        } else { 
            revert("Not in scope of quest");
        }

    }
}
