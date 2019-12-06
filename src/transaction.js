const SHA256 = require('crypto-js/sha256')
const { renderObject, reveal } = require('./utils')


module.exports = class Transaction {
	/**
	 * @param {integer} id - Transaction id
	 * @param {User.id} from - Transaction emitter
	 * @param {User.id} to - Transaction recipient
	 * @param {number} amount - Transaction amount
	 */
	constructor(id, from, to, amount) {
		this.id = id

		this.isReward = (from === null)

		this.from = from
		this.to = to
		this.amount = amount

		this.timestamp = Date.now()

		this.signature = ""


		////////
		// Console utils
		///
		this.emphaseList = []
	}

	/**
	 * Sign the transaction
	 * @param {RSA_KEY} privateKey - Emitter private key
	 */
	sign(privateKey) {
		this.signature = privateKey.sign(this.generateHash()).toDER('hex')
	}

	/**
	 * Check the transaction's signature
	 * @param {RSA_KEY} publicKey - Emitter public key
	 * @returns {boolean} - Wether the signature is valid or not
	 */
	checkSignature(publicKey) {
		return publicKey.verify(this.generateHash(), this.signature)
	}

	/**
	 * Generate the Transaction's hash
	 * @returns {string} - Hash value
	 */
	generateHash() {
		return SHA256(this.toString()).toString()
	}


	/**
	 * Prepare the transaction for hashing method
	 * @returns {string} - Transaction stringified
	 */
	toString() {
		return [
			this.id,
			this.from,
			this.to,
			this.amount,
			this.timestamp
		].join(':')
	}



	////////
	// Console utils
	///
	print() {
		let title = this.isReward ? "Reward" : "Transaction"
		let from = this.emphaseList.includes("from") ? reveal(this.from) : this.from
		let to = this.emphaseList.includes("to") ? reveal(this.to) : this.to
		let signature = this.emphaseList.includes("signature") ? reveal(this.signature) : this.signature
		return renderObject(title, this.id, [
			`from: ${from}, to: ${to}, amount: ${this.amount}`,
			`signature: ${signature}`,
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}