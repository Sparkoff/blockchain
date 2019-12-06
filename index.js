const BlockChain = require('./src/blockchain')
const Miner = require('./src/miner')
const { renderStep, renderFullBlockchain, title } = require('./src/utils')



let blockchain = new BlockChain("test")

let toto = (new Miner('toto')).connect(blockchain)
let tata = (new Miner('tata')).connect(blockchain)
let titi = (new Miner('titi')).connect(blockchain)
let tutu = (new Miner('tutu')).connect(blockchain)

renderFullBlockchain(blockchain)



console.group(title("test 1"))
renderStep('>>> add few transactions...')
toto.pay(tata, 10)
titi.pay(tata, 5)
tata.pay(tutu, 15)
renderFullBlockchain(blockchain)

renderStep('\n>>> create block...')
toto.mining()
renderStep('<<< block creation succeed !\n')

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()




console.group(title("test 2"))
renderStep('>>> add other transactions and create blocks...')
tutu.pay(tata, 5)
tata.pay(toto, 5)
titi.mining()
tutu.pay(toto, 5)
toto.pay(tata, 10)
titi.mining()

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()




console.group(title("test 7"))
renderStep('>>> titi steals tutu\'s money from first block by creating a new transaction...')
let transaction = titi.blockchain.addTransaction(tutu.id, titi.id, 15)
transaction.sign(titi.private)
transaction.emphase("from", "signature")

renderStep('>>> add other transactions and create a block...')
tata.pay(toto, 5)
tutu.pay(toto, 5)
toto.mining()

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()