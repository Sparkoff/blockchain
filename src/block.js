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


		////////
		// Console utils
		///
		this.emphaseList = []
	}



	////////
	// Console utils
	///
	print() {
		return renderObject(`Block (miner: ${this.minerId})`, this.id, [
			...subRender("data", this.data),
			`timestamp: ${this.timestamp}`
		])
	}

	emphase(...item) {
		this.emphaseList.push(...item)
	}
}