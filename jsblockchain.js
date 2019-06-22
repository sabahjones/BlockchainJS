const SHA256 = require('crypto-js/sha256') //import hash module


/* ------------ Transaction class  --------------- */

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


/* ------------ Block class  --------------- */

class Block {  // template for each block
    constructor(timestamp, transactions, previoushash = '') {  // remove index Block will be an array
        //this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;   // data will be transactions to represent cryptocurrency
        this.previoushash = previoushash;
        this.hash = this.calculateHash(); // variables needed for each Block
        this.nonce = 0; // variable needed for secure hash generation
    }

    calculateHash() { // used to calculate this block's hash using SHA256 in crypto-js package
        return SHA256(this.index + this.timestamp + this.previoushash + JSON.stringify(this.transactions) + this.nonce).toString();
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


// ---------- BlockCHAIN class -----------

class BlockChain { // template for each chain
    constructor() {
        this.chain = [this.createGenesisBlock()]; // creates the first block 'genesis' in the chain.
        this.difficulty = 2;                      // random difficulty value, designed to radomize bcrypt-js hash with a non package value
        this.pendingTransactions = [];            // this will hold every transaction UNTIL it is mined/confirmed.
        this.miningReward = 10                    // coins given to miner

    }

    createGenesisBlock() {
        // creates Genesis when Blockchain is created in constructor() (above)**
        return new Block("06/15/2019", "initial block", '0');       // remove index
    }

    /*  will retrieve last block to obtain 
        previous hash value for new block */
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    };


    /* this function will add a new block 
       to the chain if it passes mining  */
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLastBlock().hash);

        block.mineBlock(this.difficulty); console.log('block mined successfully');
        this.chain.push(block)          // add completed block to chain
        this.pendingTransactions = [    // add to array of pending transactions
            new Transaction(null /*FROM address*/, miningRewardAddress, this.miningReward)
        ]

    }

    /* add a new transaction to pendingTransactions[] */
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceofAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (address.fromAddress === address) {
                    balance = balance - trans.amount
                }
                if (address.toAddress === address) {
                    balance = balance + trans.amount
                }
            }
        }
        return balance // returns balance of particular address/user in chain
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



