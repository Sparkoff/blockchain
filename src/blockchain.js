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
	 * Create a new block with current pending transactions
	 * @param {Miner.id} minerId - Miner id
	 */
	publishBlock(minerId) {
		// create a block with pending transactions and miner id
		let block = new Block(
			this.chain.length,
			minerId,
			this.pendingTransactions
		)

		// clean the pending transaction list
		this.pendingTransactions = []

		// add the new block to the chain
		this.chain.push(block)
	}


	/**
	 * Check the blockchain integrity
	 * @returns {{valid: boolean, message: string}} - Blockchain validity state and message
	 */
	checkBlockchainValidity() {
		for (let i = 0; i < this.chain.length; i++) {
			let status = this.checkBlockValidity(this.chain[i])
			if (!status.valid) {
				return status
			}
		}
		return generateValidityStatus()
	}

	/**
	 * Check a given block integrity
	 * @param {Block} currentBlock - The block to be checked
	 * @returns {{valid: boolean, message: string}} - Blockchain validity state and message
	 */
	checkBlockValidity(currentBlock) {
		if (currentBlock.hash != currentBlock.generateHash()) {
			return generateValidityStatus(`Block [${currentBlock.id}]: the hash of the block isn't valid`)
		}

		return generateValidityStatus()
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