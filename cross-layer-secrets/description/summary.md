# Summary

In this quest, we dived through the Cross Layer Messaging features offered by the OP Stack.

Each Layer has a dedicated [CrossDomainMessenger](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/universal/CrossDomainMessenger.sol) contract, the [L1CrossDomainMessenger](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L1/L1CrossDomainMessenger.sol) and the [L2CrossDomainMessenger](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/L2/L2CrossDomainMessenger.sol) for the L1 and L2 layers respectively.

Those contract work together to pass messages across the different layers and allow calling function alongside optional value using the bridge.

It is possible to build more elaborated bridges on top of them such as the [ERC721Bridge](https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/universal/ERC721Bridge.sol).
