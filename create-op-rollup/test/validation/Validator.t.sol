// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import "../../contracts_/utils/Validator.sol";
import "../../contracts_/MagicLute.sol";
import "../../contracts_/utils/IOptimismPortalProxy.sol";
import "../../contracts_/solution/MockOptimismPortalProxy.sol";

contract ValidatorTest is Test {
    Validator public validator;
    MockOptimismPortalProxy public mockOptimismPortalProxy;

    function setUp() public {
        validator = new Validator();
        mockOptimismPortalProxy = new MockOptimismPortalProxy();
    }

    function testContractName() public {
        assertEq(validator.contractName(2), "Magic Lute");
    }

    function testValidate() public {
        // 1. Deploy CTF contract (and ensure it tests false by default)
        validator.deploy(2);
        assertTrue(!validator.test(address(this), 2));

        // 2. Execute a valid (mock) solution
        MagicLute lute = MagicLute(validator.deployments(address(this), 2));
        lute.registerOptimismPortal(address(mockOptimismPortalProxy));
        mockOptimismPortalProxy.l2Oracle().setLatestBlockNumber(2);

        // 3. Ensure CTF contracts tests true
        assertTrue(validator.test(address(this), 2));
    }
}
