pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
        //msg has 4 data available, msg.sender always gives address of the function caller
        //msg.data,msg.gas,msg.value,msg.sender
    }
    //payable beacuse this function expects ether
    function enter() public payable {
        //we need to check msg.value as participants need to pay some money
        require(msg.value > .01 ether);
        //if require evaluates to false program execution ends
        //else the next line get executed
        players.push(msg.sender);

    }
     //there are no easy way to true random number generator.but we can try to write a pseudo-random function
    function random() public view returns(uint) {
        return uint(keccak256(block.difficulty,now,players));
        //block.difficulty returns difficulty of the block time required to verify the block
        //now gives current time
        //we are using block difficulty,current time and address of players to generate the random number
        //keccak256 calls sha3 algorithm directly. need no initialization. available globally
    }
    //it first runs the restricted modifier and then the function if the modifier returns true
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        //transfer send complete balance money to that address
        players = new address[](0);
        //0 gives the initial length of the new array

    }
    //restricted modifier is developed to check the manager is the caller of the function or not
    modifier restricted() {
         require(msg.sender == manager);
        //require used for authentication
        _;
    }
    function getPlayers() public view returns(address[]){
        return players;
    }
}
