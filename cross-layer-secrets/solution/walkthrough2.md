# Walkthrough: Sending Cross-Layer Messages

For general message passing from L1 to L2, Optimism provides the `L1CrossDomainMessenger` contract.

> 💡 The `L1CrossDomainMessenger` is deployed on Ethereum Sepolia (i.e., L1) at `0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1`.

Messaging can be easily initiated with the contract's `sendMessage` function.

```
function sendMessage(
    address _target, 
    bytes calldata _message, 
    uint32 _minGasLimit
) external payable
```

The parameters are as follows:

* `_target`: The address of the contract on OP Sepolia that will receive the message.
* `_message`: The calldata to be sent to the target.
* `_minGasLimit`: The minimum gas limit for the transaction (e.g., `500000`).

After calling `sendMessage`, wait a few minutes for the message to be relayed to L2. Once the function is relayed, you should be able to call `getSingingWood` and read the corresponding `bytes32` value!