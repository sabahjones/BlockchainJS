const SHA256 = require('crypto-js/sha256') //import hash module

class Block {  // template for each block
    constructor(index, timestamp, data, previoushash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        // variables needed for each Block
        this.nonce = 0; // variable needed for secure hash generation
    }

    calculateHash() { // used to calculate this block's hash using SHA256 in crypto-js package
        return SHA256(this.index + this.timestamp + this.previoushash + JSON.stringify(this.data) + this.nonce).toString();
        // use required variables to create the hash
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log("hash value = ", this.hash)
    }

}



// ---------- BLOCKCHAIN CLASS -----------

class BlockChain { // template for each chain
    constructor() {
        this.chain = [this.createGenesisBlock()]; // Blockchain needs a [0] index value (below)**
        this.difficulty = 3 //random difficulty value, designed to radomize bcrypt-js hash with a non package value

    }

    createGenesisBlock() {
        // creates Genesis when Blockchain is created in constructor() (above)**
        return new Block(0, "06/15/2019", "initial block", '0');
    }

    /* adding a new block to the chain requires a few things;
        1. hash from last block
        2. create new block
        3. add hash to new block using hash from last block
        4. push new block to Blockchain */

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.previoushash = this.getLastBlock().hash; // 1. hash from last block goes into new block
        newBlock.mineBlock(this.difficulty)               // 3*. add nonce to hash (Block class method above)
        this.chain.push(newBlock);                        // 4. push new block to chain
        // 2. (Block constructor creates blocks below)
    }

    checkChainValidity() {
        for (let i = 1; i < this.chain.length - 1; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previoushash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// 2. created below (block1 and block2) 


console.log("CREATING BLOCK 1");
let block1 = new Block(1, "06/16/2019", { balance: 24 });
console.log(block1.hash)
console.log("CREATING BLOCK 2");
let block2 = new Block(2, "06/17/2019", { balance: 50 });
console.log(block2.hash)

let newChain = new BlockChain();

newChain.addNewBlock(block1);
newChain.addNewBlock(block2);
console.log(JSON.stringify(newChain, null, 4))

// console.log('Chain validity =', newChain.checkChainValidity())

//simulated hack
newChain.chain[1].data = { balance: 200 }

// console.log("Chain validity post hack =", newChain.checkChainValidity())



