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
carol.publishBlock()
renderStep('<<< block creation succeed !\n')

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()




console.group(title("test 2"))
renderStep('>>> add other transactions and create blocks...')
bob.pay(alice, 5)
alice.pay(carol, 5)
mallory.publishBlock()
bob.pay(carol, 5)
carol.pay(alice, 10)
mallory.publishBlock()

renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()




console.group(title("test 3"))
renderStep('>>> Mallory steals Bob\'s money in first block...')
mallory.blockchain.blockList[0].transactionList[2].to = mallory.id
mallory.blockchain.blockList[0].transactionList[2].emphase("to")
renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()




console.group(title("test 4"))
renderStep('>>> Mallory updates the block\'s hash...')
mallory.blockchain.blockList[0].hash = mallory.blockchain.blockList[0].generateHash()
mallory.blockchain.blockList[0].emphase("hash")
renderFullBlockchain(blockchain, 'blocks')

renderStep('>>> check validity', blockchain.checkBlockchainValidity())
console.groupEnd()