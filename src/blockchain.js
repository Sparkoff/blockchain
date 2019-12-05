const Transaction = require('./transaction')
const Block = require('./block')
const { renderObject, generateValidityStatus } = require('./utils')


module.exports = class BlockChain {
	/**
	 * @param {string} id - Blockchain name
	 */
	constructor(id) {
		this.id = id

		// list of published blocks
		this.chain = []

		// register of miners implied in the blockchain
		this.minerRegistry = {}

		// list of transactions, pending for publication in block
		this.pendingTransactions = []
		this.transactionId = 1

		// mining related properties : proof of work's complexity and miner's reward
		this.complexity = 4
		this.rewardValue = 1

		// Initiate the block chain with the genesis block (empty)
		this.generateGenesis()
	}

	/**
	 * Add miner informations to the blockchain miner registry
	 * @param {Miner.id} id - Miner id
	 * @returns {Blockchain} - Self instance
	 */
	register(id) {
		this.minerRegistry[id] = { id }
		return this
	}


	/**
	 * Add a new Transaction to the pending list
	 * @param {Miner.id} from - Transaction emitter
	 * @param {Miner.id} to - Transaction recipient
	 * @param {number} amount - Transaction amount
	 */
	addTransaction(from, to, amount) {
		let transaction = new Transaction(this.transactionId++, from, to, amount)
		this.pendingTransactions.push(transaction)
	}

	/**
	 * Create the genesis block (first block in the chain), with default value
	 */
	generateGenesis() {
		let genesis = new Block()
		genesis.freeze()

		this.chain.push(genesis)
	}

	/**
	 * Create a transaction reward
	 * @param {integer} minerId - Miner id
	 * @returns {Transaction} - Reward transaction associated to the miner id
	 */
	generateReward(minerId) {
		return new Transaction(0, null, minerId, this.rewardValue)
	}

	/**
	 * Create a new block with current pending transactions and find the proof of work
	 * @param {Miner.id} minerId - Miner id
	 * @returns {Block} - Generated block
	 */
	mining(minerId) {
		// create a block with pending transactions, miner id and hash of the last block
		let block = new Block(
			this.chain.length,
			minerId,
			this.pendingTransactions,
			this.chain[this.chain.length - 1].hash
		)

		// iterate on nonce value to get the proof of work
		while (!this.checkProof(block.generateProof())) {
			block.nonce++
		}

		return block
	}

	/**
	 * Complete a given block creation then add it to the chain
	 * @param {Block} block - the block to be published
	 */
	publishBlock(block) {
		// check proof validity
		if (this.checkProof(block.generateProof())) {
			// add reward and generate hash
			block.data.push(this.generateReward(block.minerId))
			block.freeze()

			// clean the pending transaction list
			this.pendingTransactions = []

			// add the new block to the chain
			this.chain.push(block)
		}
	}


	/**
	 * Check the blockchain integrity
	 * @returns {{valid: boolean, message: string}} - Blockchain validity state and message
	 */
	checkBlockchainValidity() {
		let status = this.checkGenesis(this.chain[0])
		if (!status.valid) {
			return status
		}
	
		for (let i = 1; i < this.chain.length; i++) {
			let status = this.checkBlockValidity(this.chain[i], this.chain[i - 1])
			if (!status.valid) {
				return status
			}
		}
		return generateValidityStatus()
	}

	/**
	 * Check if a given block is a genesis block
	 * @param {Block} currentBlock - The block to be checked
	 * @returns {{valid: boolean, message: string}} - Blockchain validity state and message
	 */
	checkGenesis(currentBlock) {
		if (currentBlock.id != 0) {
			return generateValidityStatus(`Block [${currentBlock.id}] (genesis): must have id=0 to be a genesis block`)
		}

		if (currentBlock.previousHash != 0) {
			return generateValidityStatus(`Block [${currentBlock.id}] (genesis): must have previousHash=0 to be a genesis block`)
		}

		if (currentBlock.hash != currentBlock.generateHash()) {
			return generateValidityStatus(`Block [${currentBlock.id}] (genesis): the hash of the block isn't valid`)
		}

		if (currentBlock.data.length != 0) {
			return generateValidityStatus(`Block [${currentBlock.id}] (genesis): the genesis block should not have transactions`)
		}

		return generateValidityStatus()
	}

	/**
	 * Check a given block integrity
	 * @param {Block} currentBlock - The block to be checked
	 * @param {Block} previousBlock - Previous block in the chain
	 * @returns {{valid: boolean, message: string}} - Blockchain validity state and message
	 */
	checkBlockValidity(currentBlock, previousBlock) {
		if (currentBlock.hash != currentBlock.generateHash()) {
			return generateValidityStatus(`Block [${currentBlock.id}]: the hash of the block isn't valid`)
		}

		if (currentBlock.previousHash != previousBlock.hash) {
			return generateValidityStatus(`Block [${currentBlock.id}]: the register hash of the previous block isn't valid`)
		}

		if (currentBlock.timestamp < previousBlock.timestamp) {
			return generateValidityStatus(`Block [${currentBlock.id}]: the timestamp of the block isn't valid`)
		}

		if (currentBlock.data.length == 0) {
			return generateValidityStatus(`Block [${currentBlock.id}]: a block should have transactions`)
		}

		if (!this.checkProof(currentBlock.generateProof())) {
			return generateValidityStatus(`Block [${currentBlock.id}]: the proof of work is invalid`)
		}

		// check transactions
		for (const transaction of currentBlock.data) {
			if (transaction.isReward) {
				// the reward should belong to the miner of the block
				if (transaction.to != currentBlock.minerId) {
					return generateValidityStatus(`Block [${currentBlock.id}] - Transaction [${transaction.id}]: the reward doesn't belong to the block's miner`)
				}
			}
		}

		return generateValidityStatus()
	}

	/**
	 * Check Proof of work
	 * @param {string} guess - Proof of work hash
	 * @returns {boolean} - Wether the proof is valid or not
	 */
	checkProof(guess) {
		// the guess message may starts with a defined amount (complexity) of 0
		return guess.substring(0, this.complexity) == '0'.repeat(this.complexity)
	}



	////////
	// Console utils
	///
	print() {
		return renderObject("Blockchain", this.id, [
			`chain length: ${ this.chain.length }`,
			`miners count: ${ Object.keys(this.minerRegistry).length }`,
			`transaction queue length: ${ this.pendingTransactions.length }`
		])
	}
}