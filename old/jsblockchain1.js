const SHA256 = require('crypto-js/sha256') //import hash module

class Block {  // template for each block
    constructor(timestamp, transactions, previoushash = '') {
        // this.index = index;                 index will be based on chain length
        this.timestamp = timestamp;
        this.transactions = transactions;   //transactions vs data
        this.previoushash = previoushash;
        this.hash = this.calculateHash(); // all variables needed for each Block
        this.nonce = 0; // variable needed for secure hash generation
    }

    calculateHash() { // used to calculate this block's hash using SHA256 in crypto-js package
        return SHA256(this.timestamp + this.previoushash + JSON.stringify(this.transactions) + this.nonce).toString();
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
        return new Block("06/15/2019", "initial block", '0');
    }

    /* adding a new block to the chain requires a few things;
        1. hash from last block
        2. create new block
        3. add hash to new block using hash from last block
        4. push new block to Blockchain */

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    /*  addNewBlock(newBlock) {
        Removed. This function only added one block at a time, and required 'manual' data entry and as 
        index value the new method minePendingTransactions will allow us to store an array of 'pending' 
        transactions} */

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




