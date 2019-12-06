# Simple Blockchain implementation

This project shows a step by step implementation of a simple blockchain.

It covers security points applied on various layers : the transactions, the blocks and the chain itself.


> **Small note before begining**
>
> There will be only 4 class in this implementation:
> - `Blockchain` : representing the blockchain system
> - `Block` : a container for transaction, added in the chain
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
> Also, in reality, the blockchain surely looks like a complex chained list. By simplication, the block chain will be represented by a simple list of blocks in the Blockchain class.


**Next step :** `git checkout first-step`



## 1. Implement a naive blockchain

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



## 2. Add Hash verification on Blocks

The easiest way to sure of the integrity of an element on the web is the checksum, via a hash. Traditionally, we can see md5 checksum on `<script>` tags for example.

This is the selected solutions for blockchains : each blocks is hashed independantly and any user can check the validity of a block at any time by recomputing the hash and compare with the block's hash.

> The intended properties of the hash function should be:
> * Consistency : the algorithm should always give the same hash when the same input message is used, it should not depend on any external factor (such as time, previous answers, random factors...).
> * Variability : any changes (even the most insignificant) on the input message should widely change the output hash. These variations should not be predictable before calculation.
> * Simplicity : the algorithm should run fastly, using the less calculation process : each user is supposed to be able to check the blockchain at any time and when validating an entire blockchain, with thousands of blocks, every ms can have an impact.

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

2. In `test3`, the hacked from `titi` on `Transaction 3` makes the first block to be rejected, when comparing the original hash to the current.

3. `titi` try then to update the first block's hash, making the blockchain check to be valid.
The next security point may detect changed hash.


**Next step :** `git checkout third-step`



## 3. Chain blocks with hash

This security point is meant to add difficulty to hack the system: the idea is not to add a new security system, but to fully use the existing one.

The idea is simple : each block has an hash, based on inner properties (such as id, transactions, timestamp...). The most easy way to make sure that 2 blocks relates on each other is to build a new block with a property from its predecessor, designed to depends only on this block : its hash.

So now, let's build a block with its predecessor hash, and calculate the hash of the new block based on the previous hash.

The `Bockchain.publishBlock()` now instantiate a new `Block` the ancestor hash value, and this value is used by the `Block.toString()` method to prepare the message for the `SHA` function.

It is also important to notice that the blockchain verification now also needs to check the block predecessor and compare the hash of the previous block and the hash registered in the new block to be sure there is no inconsistency at this point. We can also check for block's timeline in creation, like with timestamps (this is an example).

Then it is also important to introduce the notion of `Genesis block` : an empty block at start of the chain, not meant to be created with transactions, but also hashed. This hash will be use as ancestor for the first block with transactions.
This block is checked separately because it follows different rules than a regular block (no transactions, no previous hash...).

Let's run the demo :
```bash
node index.js
```

1. We can see that the initial state, and both previous `test1` and `test2` are still running and the validity is correct.

2. The `test4` is now rejected as the recalculate hash of the first block doesn't correspond to the registered hash of the second block.

3. `titi` try then to update the second block hash pointing on the first block. This should be rejected has the second block's hash would not be valid anymore. So `titi` also update the second block's hash.
But then the third block is rejected for the same reason as the second block, so `titi` is forced to update all the child blocks...

4. When all the chain is updated, the blockchain is then valid.
It is time to apply complexity in these update hacks.


**Next step :** `git checkout fourth-step`



## 4. Mining blocks

This security point is probably the most expected of this implementation : the blockchain mining action!
In fact, this is designed to be a game : the miners who want to create a new block have to resolve a puzzle.

This puzzle is named `Proof of Work`.

The idea is simple :
* prepare a string based on block's content for `SHA`. Some properties are not available yet, and must be excluded (especially the block's hash)
* initiate a property named `nonce` to 0 and add it to the string
* apply the `SHA` algorithm on the string and check if the resulting hash satisfies the puzzle
* if not, increment the `nonce` property in the string and hash it again, until it satisfies the puzzle

The puzzle rule must be simple : for Bitcoin, it says that the hash must start by a certain amount of zeros, named `puzzle complexity`.

At start, during the adoption phase, the complexity was 4, meaning that the miner is searching a value of `nonce` that makes a hash that starts with 4 zeros. This is easy and doesn't cost so much of time and CPU.
After some time, the blockchain become more famous and have more user. It needs to be more restrictive. The complexity is increase to 5, then 6... It increase the time and CPU resource required to create a block.
Nowadays, the complexity is around 32! (Remember : the hash is 256 characters long, as it is generated by the `SHA256` algorithm)

In order to encourage users to mine (as CPU and time required can limit enthusiasm), there is a counterpart : when a user successfully mine a block, then the blockchain add a `reward` to the user in the transactions of the block.
This reward is a special transaction as there is no emitter : the money is generated from nowhere!
Similarly to `complexity`, the `reward` also change over time : it decrease with the count of users : at start, the blockchain needs to attract users, so the compensation is great. But after time, there is a lot of potential miners, which increase the probability for a block to be mined by someone. In order to limit the count of potential miners, the reward is reduced.

Obviously, the `nonce` property is included in the block's final hash. Also, when checking the validity of a block, the `Proof of Work` of the block must be checked.
It is important to notice that the `proof of work` includes the previous block's hash, the block's data and is included in the block's hash. So, if a user wants to modify a block, he will need to recalculate the `proof of work` and the hash, update the hash in the next block, recalculate its `proof of work` and hash, etc... It is time consuming and will require a lot of CPUs to recalculate all the chain before someone can detect an issue.

This is the best security ever : time!

Let's run the demo :
```bash
node index.js
```

1. We can see that the initial state, and both previous `test1` and `test2` are still running and the validity is correct.

2. The `test5` is now rejected as the `proof of work` is not valid and each modified blocks.

3. When `titi` also updates each block's `proof of work`, the chain is valid again. But the `test6` takes time.
Let's modify the complexity to 5 if you're not convinced, or 6. Let's imagine 32!


**Next step :** `git checkout fifth-step`



## 5. Consistency on transactions

The transactions are already secured by the previous work : as described in the example, `titi` try to steal money by rewriting a transaction and finally it becomes hard for him to conclude positively. All the hashing purpose is about protecting blocks content, including transactions.

But we can think about another transaction's weakness : what if `titi` doesn't update an already published transaction (in block) but a pending one. Or what if he creates a falsy transaction and push it in the pending list ? How can transactions be protected by design like blocks?

The solution here is almost the same as blocks : each transactions will hash its content. But the added element will be a signature : the user that emit the transaction (and pay another user) will sign (digitally) the transaction, to prove he is responsible of the transaction.

One of the most used algorithm of digital signature is `RSA`. This is a good choice as it use `SHA` and is also implemented in various programming language.

> The `RSA` algorithm is an asymmetric-key encryption standard:
> * it generates 2 different keys called `public` (shared with the receiver) and `private` (kept secret by the owner)
> * a message encrypted by a key can only be decrypted by the other
>
> This algorithm can be use as a cypher for message encryption/decryption in secret communication, but it can also be used for signature.
>
> A digital signature is a way to ensure the message is complete and come from the expected origin. Its process looks like :
> * the message is hashed (with `RSA`, the hash method can be `SHA`)
> * the hash is then encrypted, using the `private key` : this is the `signature`
> * the signature and the original message are sent together
> * the receiver hash the message and decrypt the signature using the `public key`
> * if the decrypted signature and the hash doesn't match, the message has been altered or the emitter doesn't use the private key corresponding to the public key used (and may be fraudulent)

The simple way to protect transactions from modification or identity fraud will be to sign the transaction at creation with the described protocol.

Let's run the demo :
```bash
npm install
node index.js
```

1. We can see that the initial state, and both previous `test1` and `test2` are still running and the validity is correct.

2. `titi` try to another way to steal the money of `Transaction 3` by creating a new transaction of the same amount from `tutu` (the origin receiver of the transaction) to himself. This transaction is added to the pending queue, along with other authentic transactions, and a block is finally created.

3. As `titi` doesn't have `tutu`'s private key, he signed the transaction with material he have (it's own private key).

4. The fraudulent transaction is finally rejected as the signature made with `titi`'s private key doesn't match with `tutu`'s public key, registered in the blockchain.
