// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IL2OutputOracleProxy {
    function startingBlockNumber() external view returns (uint256);
    function latestBlockNumber() external view returns (uint256);
}
