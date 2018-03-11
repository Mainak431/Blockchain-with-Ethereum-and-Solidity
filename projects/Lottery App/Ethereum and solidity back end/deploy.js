const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface,bytecode} = require('./compile');

const provider = new HDWalletProvider(
  //copy paste the mnemonic to link to the rinkeby accounts
  'knock rent name asthma awkward ahead tonight round walnut punch lecture shop',
  //network we want to connect to . copy the link from infura
  'https://rinkeby.infura.io/RCkuAhCuzmIUEP9vRby3'
  //this link is actually a node where we deploy our contract
);

const web3 = new Web3(provider);
const deploy = async() => {
  const accounts = await web3.eth.getAccounts();
  //this accounts list out all accounts can be in that rinkeby network
  console.log('Attempting to deploy from account',accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data:bytecode})
  .send({gas:'1000000', from:accounts[0] });
 //we dont initially know the deployed node address
  console.log(interface);
  console.log('Contract deployed to',result.options.address);
};
deploy();
