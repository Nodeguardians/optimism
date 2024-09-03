// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockL2OutputOracleProxy {

    uint256 public startingBlockNumber = 1;
    uint256 public latestBlockNumber = 1;

    function setLatestBlockNumber(uint256 _latestBlockNumber) external {
        latestBlockNumber = _latestBlockNumber;
    }
}
