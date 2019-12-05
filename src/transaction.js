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


		////////
		// Console utils
		///
		this.emphaseList = []
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
		let to = this.emphaseList.includes("to") ? reveal(this.to) : this.to
		return renderObject(title, this.id, [
			`from: ${this.from}, to: ${to}, amount: ${this.amount}`,
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}