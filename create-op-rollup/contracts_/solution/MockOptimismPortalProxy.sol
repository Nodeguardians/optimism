// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MockL2OutputOracleProxy.sol";

contract MockOptimismPortalProxy {
    MockL2OutputOracleProxy public l2Oracle;

    constructor() {
        l2Oracle = new MockL2OutputOracleProxy();
    }
}
