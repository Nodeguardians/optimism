// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import "../../contracts_/utils/Validator.sol";
import "../../contracts_/private/LuteMaker1.sol";
import "../../contracts_/private/LuteMaker2.sol";

contract ValidatorTest is Test {
    using stdStorage for StdStorage;

    Validator public validator;

    function setUp() public {
        validator = new Validator();
    }

    function testContractName() public {
        assertEq(validator.contractName(1), "Lute Maker 1");
        assertEq(validator.contractName(2), "Lute Maker 2");
    }

    function testValidate_1() public {
        // 1. Deploy CTF contract (and ensure it tests false by default)
        validator.deploy(1);
        assertTrue(!validator.test(address(this), 1));

        // 2. Execute a valid solution
        LuteMaker1 luteMaker = LuteMaker1(
            validator.deployments(address(this), 1)
        );

        bytes32 singingWood = keccak256(
            abi.encodePacked("Harpy hair for:", address(this)
        ));

        luteMaker.giveHarpyHair(singingWood);

        // 3. Ensure CTF contracts tests true
        assertTrue(validator.test(address(this), 1));

    }

    function testValidate_2() public {
        // 1. Deploy CTF contract (and ensure it tests false by default)
        validator.deploy(2);
        assertTrue(!validator.test(address(this), 2));

        // 2. Execute a valid solution
        LuteMaker2 luteMaker = LuteMaker2(
            validator.deployments(address(this), 2)
        );

        bytes32 harpyHair = keccak256(
            abi.encodePacked("Singing wood for:", address(this))
        );

        luteMaker.giveSingingWood(harpyHair);

        // 2. Ensure CTF contracts tests true
        assertTrue(validator.test(address(this), 2));
    }
}
