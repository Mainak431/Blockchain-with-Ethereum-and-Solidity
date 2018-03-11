import Web3 from 'web3';

const web3 = new Web3(window.web3.currentProvider);
//hijacking the provider provided by metamask by default . we use our web3 version
// but the default provider
export default web3;
