// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract L1CoastalMaps is ERC721 {
    address owner;

    constructor() ERC721("Coastal Map", "COASTAL MAP") {
        owner = msg.sender;
    }

    function mint(address to, uint256 tokenId) public {
        require(msg.sender == owner, "Not authorized");
        _mint(to, tokenId);
    }
    
}
