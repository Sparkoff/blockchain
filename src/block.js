const SHA256 = require('crypto-js/sha256')
const { renderObject, subRender, reveal } = require('./utils')


module.exports = class Block {
	/**
	 * @param {integer} id - Block id
	 * @param {Miner.id} minerId - Miner id of the creator
	 * @param {Transaction[]} data - List of transactions
	 * @param {string} previousHash - Hash of the previous block
	 */
	constructor(id, minerId, data, previousHash) {
		this.id = id || 0
		this.minerId = minerId

		// list of transactions
		this.data = data || []

		this.timestamp = 0

		this.nonce = 0
		this.previousHash = previousHash || 0
		this.hash = ""


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
	 * Generate the Block's proof of work
	 * @returns {string} - Hash value
	 */
	generateProof() {
		return SHA256(this.toString(true)).toString()
	}

	/**
	 * Finalize the block's creation
	 */
	freeze() {
		this.timestamp = Date.now()
		this.hash = this.generateHash()
	}

	/**
	 * Prepare the block for hashing method
	 * @param {boolean} forProof - Generate block's string for proof hash
	 * @returns {string} - Block stringified
	 */
	toString(forProof) {
		let propertyList = [
			this.minerId,
			this.dataToString(),
			this.previousHash,
			this.nonce
		]
		if (!forProof) {
			propertyList.push(this.timestamp)
		}
		return propertyList.join(':')
	}

	/**
	 * Prepare the trasactions to be hashed
	 * @returns {string} - List of transaction stringified
	 */
	dataToString() {
		return this.data.filter(t => !t.isReward)
						.map(t => t.toString())
						.join('|')
	}



	////////
	// Console utils
	///
	print() {
		let hash = this.emphaseList.includes("hash") ? reveal(this.hash) : this.hash
		let previousHash = this.emphaseList.includes("previousHash") ? reveal(this.previousHash) : this.previousHash
		let nonce = this.emphaseList.includes("nonce") ? reveal(this.nonce) : this.nonce
		return renderObject(`Block (miner: ${this.minerId})`, this.id, [
			...subRender("data", this.data),
			`previousHash: ${previousHash}`,
			`hash: ${hash}`,
			`nonce: ${nonce}`,
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}