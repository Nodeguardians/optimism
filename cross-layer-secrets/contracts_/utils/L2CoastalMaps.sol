// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@eth-optimism/contracts-bedrock/src/universal/OptimismMintableERC721.sol";

contract L2CoastalMaps is OptimismMintableERC721 {

    /* L2 ERC721 Bridge: https://github.com/ethereum-optimism/optimism/blob/129032f15b76b0d2a940443a39433de931a97a44/packages/contracts-bedrock/src/constants.ts */
    address constant l2Erc721Bridge = 0x4200000000000000000000000000000000000014;

    constructor(
        address _l1Address
    ) OptimismMintableERC721(
        l2Erc721Bridge, 
        5, 
        _l1Address, 
        "Coastal Map", 
        "COASTAL MAP"
    ) {}

}
