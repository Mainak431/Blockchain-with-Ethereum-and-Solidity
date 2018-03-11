import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {manager:'',players:[],balance:'',value:''};
  }
  //componentDidMount method is default method of out metamask contract
  //this gets automatically called whenever a contract is loaded
  async componentDidMount(){
    //fetching manager and metamask web3 version automatically fetches from the
    //first account we created
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    //getbalance is a by default method of any contract
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance});
  }
  //=> ensures that the this property is inside the function is set to the component
  onSubmit = async(event)=> {
    event.preventDefault();
    //preventDefault a inbuilt function prevents us from submittig the default form
    const accounts = await web3.eth.getAccounts();
    this.setState({message:'Waiting on transaction success...This may take upto a minute'});
    await lottery.methods.enter().send({
      from:accounts[0],
      value : web3.utils.toWei(this.state.value,'ether')
    })
    this.setState({message:'You have been Successfully Entered!'})
  }

  onClick = async()=> {
      const accounts = await web3.eth.getAccounts();
      this.setState({message:'Waiting on transaction success...This may take upto a minute'})
      await lottery.methods.pickWinner().send({
        from : accounts[0]
      })
      this.setState({message:'A winner has been picked!'})
  }

  render() {
    web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2> Lottery </h2>
        <p> This Contract is managed by {this.state.manager}</p>
        <p> There are currently {this.state.players.length} people entered</p>
        <p> Competing to win {web3.utils.fromWei(this.state.balance,'ether')} ether! </p>
        <hr />
        <form onSubmit = {this.onSubmit}>
          <h4> Want to try your luck ? </h4>
          <div>
            <label> Amount of the ether to enter </label>
            <input
              value = {this.state.value}
              onChange = {event => this.setState({value:event.target.value})}
              />
          </div>
          <button>
            Enter
          </button>
        </form>
        <hr />
          <h4> Ready to pick a winner ? </h4>
          <button onClick = {this.onClick}>
            Pick a winner!
          </button>
        <hr />
          <h1>{this.state.message} </h1>
      </div>

    );
  }
}

export default App;
