# Simple Blockchain implementation

This project shows a step by step implementation of a simple blockchain.

It covers security points applied on various layers : transactions, blocks and the chain.


> **Small note before begining**
>
> There will be only 4 class in this implementation:
> - `Blockchain` : representing the blockchain system
> - `Block` : a container fro transaction, added in the chain
> - `Miner` : a blockchain user
> - `Transaction` : an object representing a transaction between 2 miners
>
> All these classes are implemented in the `src/` directory.
> The `src/utils.js` file only provides some printing helpers for console.
> The `index.js` contains the scenario which will evolve during the steps.
>
> It is important to notice that in the reality, the blockchain is replicated between all users. In this implementation, all miners will interact on a common Blockchain object.
> By this simplification, the reader will not be distract by any data synchronisation between users.
>
> Also, in reality, the blockchain surely looks like a complex chained list. By simplication, the clock chain will be represented by a simple list of blocks in the Blockchain class.


**Next step :** `git checkout first-step`



## Firstly : implement a naive blockchain

At this step, the blockchain is minimalistic.
It consist on a group of `miners`, who can `pay` each other (which mean to create a new transaction).

When a transaction is created, through the `Miner.pay()` method, the `Blochain` instantiate a new `Transaction` and push it to the transaction pending list.

When there is enough transaction in the pending list, a miner try to publish a Block by calling the `Blockchain.publishBlock()` method, which:
- instantiate a new `Block` with the current pending transactions (in reality, it would be a bulk of this list)
- remove the published set of transactions from the pending list (clearing the list)
- push the new `Block` in the chain (`Blockchain.chain`)

Let's run the demo :
```bash
npm install
node index.js
```

1. We can see the `Blockchain` in its initial state : no pending transaction, no published blocks and 4 miners.

2. The group share transactions and creates 3 blocks (`test1`and `test2`).

3. The miner called `titi` try to change the `Transaction 3` from the first block, switching the transaction original recipent by himself.
We can see in `test3` that it works, and there is no way to identify the robbery.
It is time to apply the first security point.


**Next step :** `git checkout second-step`