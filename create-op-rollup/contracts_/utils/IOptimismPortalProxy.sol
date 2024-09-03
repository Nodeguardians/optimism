// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IL2OutputOracleProxy.sol";

interface IOptimismPortalProxy {
    function l2Oracle() external view returns (IL2OutputOracleProxy);
}
