module.exports = class Miner {
	/**
	 * @param {string} id - Miner id
	 */
	constructor(id) {
		this.id = id
		this.blockchain = null
	}

	/**
	 * Connect the user to a blockchain
	 * @param {Blockchain} blockchain - Target blockchain system
	 * @returns {Miner} - Self instance
	 */
	connect(blockchain) {
		this.blockchain = blockchain.register(this.id)
		return this
	}


	/**
	 * 
	 * @param {Miner.id} to - Payment recipient
	 * @param {number} amount - Payment amount
	 */
	pay(to, amount) {
		this.blockchain.addTransaction(this.id, to.id, amount)
	}

	/**
	 * Create a new block in the Blockchain
	 */
	publishBlock() {
		this.blockchain.publishBlock(this.id)
	}
}