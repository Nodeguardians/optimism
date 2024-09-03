// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@node-guardians/ng-quests-contracts/IValidator.sol";

import "../MagicLute.sol";
import "./IOptimismPortalProxy.sol";

contract Validator is IValidator {
    mapping(address => MagicLute) public lutes;

    function deploy(uint256 k) public override {
        require(k == 2, "Not in scope of quest");
        lutes[msg.sender] = new MagicLute(msg.sender);
    }

    function deployments(address user, uint k) external view returns (address) {
        require(k == 2, "Not in scope of quest");
        return address(lutes[user]);
    }

    function test(address user, uint256 k) public view override returns (bool) {
        require(k == 2, "Not in scope of quest");
        MagicLute lute = lutes[user];

        if (address(lute) == address(0)) {
            return false;
        }

        address portalAddress = lute.optimismPortal();

        if (portalAddress == address(0)) {
            return false;
        }

        IL2OutputOracleProxy oracle = IOptimismPortalProxy(portalAddress)
            .l2Oracle();
        uint256 blockCount = oracle.latestBlockNumber() -
            oracle.startingBlockNumber();

        return blockCount > 0;
    }

    function contractName(uint256 k) external pure returns (string memory) {
        require(k == 2, "Not in scope of quest");
        return "Magic Lute";
    }
}
