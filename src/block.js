const SHA256 = require('crypto-js/sha256')
const { renderObject, subRender, reveal } = require('./utils')


module.exports = class Block {
	/**
	 * @param {integer} id - Block id
	 * @param {Miner.id} minerId - Miner id of the creator
	 * @param {Transaction[]} data - List of transactions
	 */
	constructor(id, minerId, data) {
		this.id = id || 0
		this.minerId = minerId

		// list of transactions
		this.data = data || []

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
			this.minerId,
			this.dataToString(),
			this.timestamp
		].join(':')
	}

	/**
	 * Prepare the trasactions to be hashed
	 * @returns {string} - List of transaction stringified
	 */
	dataToString() {
		return this.data.map(t => t.toString())
						.join('|')
	}



	////////
	// Console utils
	///
	print() {
		let hash = this.emphaseList.includes("hash") ? reveal(this.hash) : this.hash
		return renderObject(`Block (miner: ${this.minerId})`, this.id, [
			...subRender("data", this.data),
			`hash: ${hash}`,
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}