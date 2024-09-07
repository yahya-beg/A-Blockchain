//import SHA256 from 'BLOCKCHAIN/node_modules/crypto-js/sha256';
const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(senderAdresse, receiverAdresse, amount){
      this.senderAdresse= senderAdresse ;
      this.receiverAdresse = receiverAdresse ;
      this.amount = amount ;
    }
}


class Block{
  constructor(timestamp, transactions, previousHash =''){
    
    this.timestamp = timestamp;
    this.transactions= transactions ;
    this.previousHash = previousHash;
    this.hash = this.calculateHash() ;
    this.nonce = 0;
  }
  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+ this.nonce).toString();
  }
 
  mineBlock(difficulty){
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++ ;
      this.hash = this.calculateHash();
    }
    
    console.log("Block mined: " + this.hash);
  }
}

class Blockchain{
  constructor(){
    this.chain=[this.createGenesisBlock()];
    this.difficulty = 1; 
    this.pendingTransactions = [];
    this.miningReward = 200 ;
  } ;

  createGenesisBlock(){
    return new Block("21/07/2022", "Genesis block", "0");

  }

  getPreviousBlock(){
    return this.chain[this.chain.length-1];
  }
 /*****replaced by the method bellow **************
  addBlock(newBlock){
    newBlock.previousHash = this.getPreviousBlock().hash;
    //newBlock.hash= newBlock.calculateHash(); replaced with the next line .
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  *********************************************/
 minePendingTransactions(minerAdresse){ //after mining a transaction we'll send a reward to the miner
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("block successfully mined");
    this.chain.push(block);

    this.pendingTransactions = [
     new Transaction(null,minerAdresse, this.miningReward)
    ];
 }
createTransaction(transaction){
  this.pendingTransactions.push(transaction);
}

getBalanceofAdresse(Adresse){
  let balance = 0 ;

  for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.senderAdresse === Adresse){
          balance -= trans.amount ;
        }
        if(trans.receiverAdresse === Adresse){
          balance += trans.amount ;
        }
      }
  }
  return balance ;
}


}

let MyBlockchain = new Blockchain();
/******************** 
console.log('Mining block 1 :');
MyBlockchain.addBlock(new Block(1, "03/05/2022", { Amount: 84}));
console.log('Mining block 2 :');
MyBlockchain.addBlock(new Block(2, "25/07/2022", { Amount: 105}));

console.log(JSON.stringify(MyBlockchain, null, 8));
*******************************/
MyBlockchain.createTransaction(new Transaction('adresse1', 'adresse2', 1000));
MyBlockchain.createTransaction(new Transaction('adresse3', 'adresse2', 2000));

console.log('\n starting the miner,...');
MyBlockchain.minePendingTransactions('yahya-adresse');

console.log('\n Balance of yahya is :', MyBlockchain.getBalanceofAdresse('yahya-adresse'));

console.log('\n starting the miner again,...');
MyBlockchain.minePendingTransactions('yahya-adresse');
console.log('\n Balance of yahya is :', MyBlockchain.getBalanceofAdresse('yahya-adresse'));

console.log('\n starting the miner for test...');
MyBlockchain.minePendingTransactions('x-adresse');
console.log('\n Balance of x is :', MyBlockchain.getBalanceofAdresse('x-adresse'));
console.log(JSON.stringify(MyBlockchain, null, 8));