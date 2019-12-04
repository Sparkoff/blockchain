const SHA256 = require('crypto-js/sha256')
const { renderObject, subRender, reveal } = require('./utils')


module.exports = class Block {
	/**
	 * @param {integer} id - Block id
	 * @param {User.id} userId - User id of the creator
	 * @param {Transaction[]} transactionList - List of transactions
	 */
	constructor(id, userId, transactionList) {
		this.id = id || 0
		this.userId = userId

		// list of transactions
		this.transactionList = transactionList || []

		this.timestamp = Date.now()

		this.hash = this.generateHash()


		////////
		// Console utils
		///
		this.emphaseList = []
	}


	/**
	 * Generate the Block's hash
	 * @returns {string} - Hash value
	 */
	generateHash() {
		return SHA256(this.toString()).toString()
	}

	/**
	 * Prepare the block for hashing method
	 * @returns {string} - Block stringified
	 */
	toString() {
		return [
			this.userId,
			this.dataToString(),
			this.timestamp
		].join(':')
	}

	/**
	 * Prepare the trasactions to be hashed
	 * @returns {string} - List of transaction stringified
	 */
	dataToString() {
		return this.transactionList
					.map(t => t.toString())
					.join('|')
	}



	////////
	// Console utils
	///
	print() {
		let hash = this.emphaseList.includes("hash") ? reveal(this.hash) : this.hash
		return renderObject(`Block (user: ${this.userId})`, this.id, [
			...subRender("transactionList", this.transactionList),
			`hash: ${hash}`,
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}