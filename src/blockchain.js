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
		this.blockList = []

		// register of users implied in the blockchain
		this.userRegistry = {}

		// list of transactions, pending for publication in block
		this.pendingTransactions = []
		this.transactionId = 1
	}

	/**
	 * Add user informations to the blockchain user registry
	 * @param {User.id} id - User id
	 * @returns {Blockchain} - Self instance
	 */
	register(id) {
		this.userRegistry[id] = { id }
		return this
	}


	/**
	 * Add a new Transaction to the pending list
	 * @param {User.id} from - Transaction emitter
	 * @param {User.id} to - Transaction recipient
	 * @param {number} amount - Transaction amount
	 */
	addTransaction(from, to, amount) {
		let transaction = new Transaction(this.transactionId++, from, to, amount)
		this.pendingTransactions.push(transaction)
	}

	/**
	 * Create a new block with current pending transactions
	 * @param {User.id} userId - User id
	 */
	publishBlock(userId) {
		// create a block with pending transactions and user id
		let block = new Block(
			this.blockList.length,
			userId,
			this.pendingTransactions
		)

		// clean the pending transaction list
		this.pendingTransactions = []

		// add the new block to the chain
		this.blockList.push(block)
	}


	/**
	 * Check the blockchain integrity
	 * @returns {{valid: boolean, message: string}} - Blockchain validity state and message
	 */
	checkBlockchainValidity() {
		for (let i = 0; i < this.blockList.length; i++) {
			let status = this.checkBlockValidity(this.blockList[i])
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
			`blockList length: ${this.blockList.length}`,
			`users count: ${Object.keys(this.userRegistry).length}`,
			`transaction queue length: ${this.pendingTransactions.length}`
		])
	}
}