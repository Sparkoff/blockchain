# Simple Blockchain implementation

This project shows a step by step implementation of a simple blockchain.

It covers security points applied on various layers : the transactions, the blocks and the chain itself.


> **Small note before begining**
>
> There will be only 4 class in this implementation:
> - `Blockchain` : representing the blockchain system
> - `Block` : a container for transaction, added in the chain
> - `User` : a blockchain user
> - `Transaction` : an object representing a transaction between 2 users
>
> All these classes are implemented in the `src/` directory.
> The `src/utils.js` file only provides some printing helpers for console.
> The `index.js` contains the scenario which will evolve during the steps.
>
> It is important to notice that in the reality, the blockchain is replicated between all users. In this implementation, all users will interact on a common Blockchain object.
> By this simplification, the reader will not be distract by any data synchronisation between users.
>
> Also, in reality, the blockchain surely looks like a complex chained list. By simplication, the block chain will be represented by a simple list of blocks in the Blockchain class.


**Next step :** `git checkout first-step`



## 1. Implementation of a naive blockchain

At this step, the blockchain is minimalistic.
It consist on a group of `users`, who can `pay` each other (which mean to create a new transaction).

When a transaction is created, through the `User.pay()` method, the `Blochain` instantiate a new `Transaction` and push it to the transaction pending list.

When there is enough transaction in the pending list, a user try to publish a Block by calling the `Blockchain.publishBlock()` method, which:
- instantiate a new `Block` with the current pending transactions (in reality, it would be a bulk of this list)
- remove the published set of transactions from the pending list (clearing the list)
- push the new `Block` in the chain (`Blockchain.blockList`)

Let's run the demo :
```bash
npm install
node index.js
```

1. We can see the `Blockchain` in its initial state : no pending transaction, no published blocks and 4 users.

2. The group share transactions and creates 3 blocks (`test1`and `test2`).

3. The user called `mallory` try to change the `Transaction 3` from the first block, switching the transaction original recipent by himself.
We can see in `test3` that it works, and there is no way to identify the robbery.
It is time to apply the first security point.


**Next step :** `git checkout second-step`



## 2. Add Hash verification on Blocks

The easiest way to sure of the integrity of an element on the web is the checksum, via a hash. Traditionally, we can see md5 checksum on `<script>` tags for example.

This is the selected solutions for blockchains : each blocks is hashed independantly and any user can check the validity of a block at any time by recomputing the hash and compare with the block's hash.

> The intended properties of the hash function should be:
> * Consistency: the algorithm should always give the same hash when the same input message is used, it should not depend on any external factor (such as time, previous answers, random factors...).
> * Variability: any changes (even the most insignificant) on the input message should widely change the output hash. These variations should not be predictable before calculation.
> * Simplicity: the algorithm should run fastly, using the less calculation process : each user is supposed to be able to check the blockchain at any time and when validating an entire blockchain, with thousands of blocks, every ms can have an impact.

Concerning the Bitcoin, and maybe other blockchains, it appears that the hash function in use is `SHA256`.
* The reason for this choice is, according to articles, that the `SHA` algorithm fits well the intended properties for this job : it offers a strong consistencies along with a very good variation on small changes.
* Also, it is a well-known algorithm, implemented in a large bunch of language. This allows developers to be agnostic in their choice for implementing a Bitcoin client.
* Besides this choice, there is multiple `SHA` flavors, such as `SHA128`, `SHA256`, `SHA512`... It simply define the length of the output hash. The choice of `SHA256` is a compromise between output hash variety (16^256 possible combinations) and generation speed/computation power (the `SHA512` can reach the second to compute a hash from a large input).

In practice, we need to be able to stringify `Transaction`s and `Block`s, and transmit the give string as an input for `SHA256`.
To do so, `Transaction` and `Block` classes both implements a `toString()` method which takes the attributes of the class which need to be "frozen" and concatenate them into a single message. The `Block.toString()` method then concatenate its properties with `Transaction`s.

The `Block.generateHash()` is responsible a computing the block's hash (with inner transactions). This method is call in the constructor, in order to set the block's hash, but can be recalled at any time for comparison, such as in `Blockchain.checkBlockValidity()`.

Concerning blockchain validity, `Blockchain.checkBlockchainValidity()` is designed to cycle through blocks, calling `Blockchain.checkBlockValidity()` which checks the block content.

Let's run the demo :
```bash
npm install
node index.js
```

1. We can see that the initial state, and both previous `test1` and `test2` are still running and the validity is correct.

2. In `test3`, the hacked from `mallory` on `Transaction 3` makes the first block to be rejected, when comparing the original hash to the current.

3. `mallory` try then to update the first block's hash, making the blockchain check to be valid.
The next security point may detect changed hash.


**Next step :** `git checkout third-step`