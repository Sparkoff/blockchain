const BlockChain = require('./src/blockchain')
const User = require('./src/user')
const { renderStep, renderFullBlockchain, title } = require('./src/utils')



let blockchain = new BlockChain("test")

let alice = (new User('alice')).connect(blockchain)
let bob = (new User('bob')).connect(blockchain)
let carol = (new User('carol')).connect(blockchain)
let mallory = (new User('mallory')).connect(blockchain)

renderFullBlockchain(blockchain)



console.group(title("test 1"))
renderStep('>>> add few transactions...')
carol.pay(alice, 10)
mallory.pay(alice, 5)
alice.pay(bob, 15)
renderFullBlockchain(blockchain)

renderStep('\n>>> create block...')
carol.mining()
renderStep('<<< block creation succeed !\n')

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()




console.group(title("test 2"))
renderStep('>>> add other transactions and create blocks...')
bob.pay(alice, 5)
alice.pay(carol, 5)
mallory.mining()
bob.pay(carol, 5)
carol.pay(alice, 10)
mallory.mining()

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()




console.group(title("test 7"))
renderStep('>>> Mallory steals Bob\'s money from first block by creating a new transaction...')
let transaction = mallory.blockchain.addTransaction(bob.id, mallory.id, 15)
transaction.sign(mallory.private)
transaction.emphase("from", "signature")

renderStep('>>> add other transactions and create a block...')
alice.pay(carol, 5)
bob.pay(carol, 5)
carol.mining()

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()