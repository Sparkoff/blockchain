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

		this.from = from
		this.to = to
		this.amount = amount

		this.timestamp = Date.now()


		////////
		// Console utils
		///
		this.emphaseList = []
	}



	////////
	// Console utils
	///
	print() {
		let to = this.emphaseList.includes("to") ? reveal(this.to) : this.to
		return renderObject("Transaction", this.id, [
			`from: ${this.from}, to: ${to}, amount: ${this.amount}`,
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}