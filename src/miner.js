const EC = new (require('elliptic').ec)('secp256k1')


module.exports = class Miner {
	/**
	 * @param {string} id - Miner id
	 */
	constructor(id) {
		this.id = id
		this.blockchain = null

		this.public = null
		this.private = null

		this.generateKeys()
	}

	/**
	 * Connect the user to a blockchain
	 * @param {Blockchain} blockchain - Target blockchain system
	 * @returns {Miner} - Self instance
	 */
	connect(blockchain) {
		this.blockchain = blockchain.register(this.id, this.public)
		return this
	}

	/**
	 * Generate pair of public/private keys for the miner
	 */
	generateKeys() {
		const keys = EC.genKeyPair()

		// get hash keys
		// public = keys.getPublic('hex')
		// private = keys.getPrivate('hex')

		this.public = EC.keyFromPublic(keys.getPublic('hex'), 'hex')
		this.private = EC.keyFromPrivate(keys.getPrivate('hex'), 'hex')
	}


	/**
	 * 
	 * @param {Miner.id} to - Payment recipient
	 * @param {number} amount - Payment amount
	 */
	pay(to, amount) {
		this.blockchain.addTransaction(this.id, to.id, amount)
					   .sign(this.private)
	}

	/**
	 * Create a new block in the Blockchain
	 */
	mining() {
		let block = this.blockchain.mining(this.id)
		this.blockchain.publishBlock(block)
	}
}