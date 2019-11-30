const Transaction = require('./transaction')
const Block = require('./block')
const { renderObject } = require('./utils')


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