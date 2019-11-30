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


		////////
		// Console utils
		///
		this.emphaseList = []
	}



	////////
	// Console utils
	///
	print() {
		return renderObject(`Block (user: ${this.userId})`, this.id, [
			...subRender("transactionList", this.transactionList),
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}