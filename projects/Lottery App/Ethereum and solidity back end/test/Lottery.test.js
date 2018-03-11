const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');
let lottery;
let accounts;

beforeEach(async()=> {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data:bytecode})
  .send({from:accounts[0], gas:'1000000'});
});

describe('Lottery Contract', ()=> {
  it('deploys a contract', ()=> {
    assert.ok(lottery.options.address);
  });
  it('allows multiple accounts to enter', async() => {
    await lottery.methods.enter().send({
      from :accounts[0],
      value : web3.utils.toWei('0.02','ether')
    });
    await lottery.methods.enter().send({
      from :accounts[1],
      value : web3.utils.toWei('0.02','ether')
    });
    await lottery.methods.enter().send({
      from :accounts[2],
      value : web3.utils.toWei('0.02','ether')
    });
    const player = await lottery.methods.getPlayers().call({
      from:accounts[0]
    });
    assert.equal(accounts[0],player[0]);
    assert.equal(accounts[1],player[1]);
    assert.equal(accounts[2],player[2]);
    assert.equal(3,player.length);
  });
  it('requires a minimum amount of ether', async()=> {
    try {
          await lottery.methods.enter().send({
          from: accounts[0],
          value : 200,
          //wei is the amount and we require 0.01 ether far more than 200 wei
        });
        assert(false);
        //assert false always throws error
      } catch (err) {
        assert.ok(err);// assert.ok only assures that some value is passed in the ok block
      }
  });
  it('only manager can call pick winner', async()=> {
    try {
      await lottery.methods.pickWinner().send({
        from :accounts[0]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }

  });
  it('sends money to the winner and resets the players array', async()=> {
    await lottery.methods.enter().send ({
      from: accounts[0],
      value :web3.utils.toWei('2','ether')
    });
    const initialbal = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });
    const finalBal = await web3.eth.getBalance(accounts[0]);
    const diff = finalBal - initialbal;
    assert(diff>web3.utils.toWei('1.8','ether'));
    console.log(finalBal - initialbal);
    //as some amount of money is spent on gas. we check for some amount less than 2
  });
});
