const { ethers } = require('ethers');
const contract = require('./Lock.json');

// Contract address and provider
const contractAddress = '0xfa77d941479A9a0B59C67510983df09dA59E2b25';
const infuraProvider = new ethers.JsonRpcProvider(
    'https://sepolia.infura.io/v3/cdf2a29bbe4a45218e91aaaa2aa87b9a'
);

// Contract instance with provider
const contractInstance = new ethers.Contract(
    contractAddress,
    contract.abi,
    infuraProvider
);

// Use a private key to create a signer (for Node.js)
const privateKey = '5c93769363cbb7a9abbbdfeae15f18fa44d0cfe08e64332d491fc11b10b366f0'; // Replace with your actual private key
const wallet = new ethers.Wallet(privateKey, infuraProvider);

// Contract instance with signer
const sendContract = new ethers.Contract(
    contractAddress,
    contract.abi,
    wallet
);

module.exports = { contractAddress, contractInstance, sendContract };
