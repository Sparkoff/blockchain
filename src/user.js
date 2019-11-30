module.exports = class User {
	/**
	 * @param {string} id - User id
	 */
	constructor(id) {
		this.id = id
		this.blockchain = null
	}

	/**
	 * Connect the user to a blockchain
	 * @param {Blockchain} blockchain - Target blockchain system
	 * @returns {User} - Self instance
	 */
	connect(blockchain) {
		this.blockchain = blockchain.register(this.id)
		return this
	}


	/**
	 * 
	 * @param {User.id} to - Payment recipient
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