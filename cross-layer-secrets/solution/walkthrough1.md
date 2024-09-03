# Walkthrough: Bridging Cross-Layer Assets

As mentioned, bridging an ERC721 token from Ethereum Sepolia to OP Sepolia can be achieved with Optimism's[`L1ERC721Bridge`](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L1/L1ERC721Bridge.sol) contract.

> 💡 The `L1ERC721Bridge` is deployed on Ethereum Sepolia (i.e., L1) at `0xd83e03D576d23C9AEab8cC44Fa98d058D2176D1f`.

Bridging can be easily initiated with the contract's `bridgeERC721` function.

```solidity
function bridgeERC721(
    address _localToken,
    address _remoteToken,
    uint256 _tokenId,
    uint32 _minGasLimit,
    bytes calldata _extraData
) external;
```
To bridge your Coastal Map, you have to firsts approve the bridge to spend your token. Then, call the `bridgeERC721` function with the following parameters:

* `_localToken`: The address of Coastal Map on Ethereum Sepolia.
* `_remoteToken`: The address of Coastal Map on OP Sepolia.
* `_tokenId`: The ID of the Coastal Map to be bridged.
* `_minGasLimit`: The minimum gas limit for the transaction (e.g., `400000`).
* `_extraData`: An empty bytestring (`""`).

The bridging process might take a few minutes. But once complete, you should be able to call `getHarpyHair` and read the corresponding `bytes32` value!

> 💡 Remember that you will need to call `getHarpyHair` from the account that holds the bridged Coastal Map!