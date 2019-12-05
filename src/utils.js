const c = require('colors/safe')


module.exports = {
	renderObject: (type, name, data) => {
		let color = "green"
		switch (type) {
			case "Blockchain":
				color = "blue"
				break
			case "Transaction":
				color = "red"
				break
			case "Reward":
				color = "yellow"
				break
		}

		let header = `${c[color]("+")} ${c[color](type)} [${c[color](name)}]`
		let footer = `${c[color]("+--")} ${data.pop()}`
		let body = data.map(s => `${c[color]("|")}   ${s}`)

		return ([header, ...body, footer]).join('\n')
	},

	subRender: (name, data) => {
		let items = 'empty'
		if (data.length) {
			items = data.map(item => item.print().split('\n'))
						.reduce((text, lines) => text.concat(lines), []) // use .flat() in Node 11+
						.map(line => `  ${line}`)
						.join('\n')
			items = `\n${items}`
		}
		return (`${name}: ${items}`).split('\n')
	},

	title: (text) => c.magenta(`\n\n=========[ ${text} ]=========`),

	renderStep: (step, data) => {
		if (typeof data == 'object' && data.hasOwnProperty("valid")) {
			if (data.valid) {
				data = `: ${c.green("[ OK ]")}`
			} else {
				data = `: ${c.red(`[ Error: ${data.message} ]`)}`
			}
		} else {
			data = ""
		}
		console.log(`${c.cyan(step)}${data}`)
	},

	renderFullBlockchain: (blockchain, printBlocks) => {
		console.group(c.blue('printing blockchain'))
		console.log(blockchain.print())
		console.groupEnd()
		if (printBlocks) {
			console.group(c.green('printing blocks'))
			blockchain.blockList.forEach(block => console.log(block.print()))
			console.groupEnd()
		}
	},

	reveal: (text) => c.bgRed(c.black(text)),

	generateValidityStatus: (message) => {
		return {
			message: message || "",
			valid: message == undefined 
		}
	}
}