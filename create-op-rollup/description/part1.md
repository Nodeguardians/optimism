# Creating an OP Rollup

You have gathered the materials required to craft Thaddeus' magical lute. Carefully, you assemble the instrument. However, according to the annals, the lute must be infused with rollup power...

Lucky for you, the OP Stack makes it convenient for anyone to deploy and run their own OP rollup.

> 💡 If you need a quick recap of the components of an OP Rollup, you can revisit the [first quest](https://nodeguardians.io/adventure/introduction-to-op-stack/start) of this campaign!

Your goal is to deploy and run your first OP Rollup. To get started, head over to Optimism's [official tutorial](https://docs.optimism.io/builders/chain-operators/tutorials/create-l2-rollup).

## Optional: Speeding up Finalization

Syncing with the L1 might take a long while (around 12 minutes in optimistic scenarios) for security purposes. When during your rollup, for pedagogical purposes, you can reduce the wait time by running `op-proposer` with the `--allow-unfinalized` flag.

The command to run the proposer would then look like this:

```sh
./bin/op-proposer \
    --poll-interval=12s \
    --rpc.port=8560 \
    --rollup-rpc=http://localhost:8547 \
    --l2oo-address=$L2OO_ADDR \
    --private-key=$PROPOSER_KEY \
    --l1-eth-rpc=$L1_RPC \
    --allow-unfinalized
```

## Your Task

Follow Optimism's [official tutorial](https://docs.optimism.io/builders/chain-operators/tutorials/create-l2-rollup) and use OP Stack to deploy your own OP Rollup. Then, produce at least one L2 block and have it synced to the L1!

## Hints

None