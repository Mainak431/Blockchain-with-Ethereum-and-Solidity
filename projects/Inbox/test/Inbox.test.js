const assert = require('assert');

const ganache = require('ganache-cli');

const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
let initialstring;
initialstring = 'Hi there!'

beforeEach(async ()=> {
  //Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  //Use one of those accounts to deploy the contract
  //interface or ABI gives the methods of the contract JSON.parse parse the interface
  inbox = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data:bytecode, arguments :[initialstring] })
  .send({ from: accounts[0], gas:'1000000' })
  inbox.setProvider(provider);
});
//send blcok shows the account from which the transaction comes and pays for it
describe('Inbox',()=> {
  it('deploys a contract',()=>{
    assert.ok(inbox.options.address);//check if the address is okk or not
  });
  //we use async when we expect a promise which will be resolved later
  it('has a default message',async() => {
    const message = await inbox.methods.message().call();
    assert.equal(message,initialstring);
  });
  it('can change the message',async()=> {
    initialstring = 'bye'
    await inbox.methods.setMessage(initialstring).send({ from: accounts[0], gas:'1000000' });
    const message = await inbox.methods.message().call();
    assert.equal(message,initialstring);
  });
});
