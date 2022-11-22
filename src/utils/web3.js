import Web3 from "web3";

var web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider(store.state.CHAIN_RPC));
window.web3 = web3;

export default web3;
