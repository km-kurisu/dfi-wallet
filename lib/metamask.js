"use client";
/**
 * Utility functions for interacting with MetaMask and Ethereum
 */

// Check if MetaMask is available
export const isMetaMaskAvailable = () => {
  if (typeof window === 'undefined') return false;
  return window.ethereum && window.ethereum.isMetaMask;
};

// Get MetaMask provider
export const getMetaMaskProvider = () => {
  if (!isMetaMaskAvailable()) return null;
  return window.ethereum;
};

// Networks supported by this application
export const supportedNetworks = {
  // Mainnet
  1: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  // Goerli Testnet
  5: {
    chainId: '0x5',
    chainName: 'Goerli Testnet',
    nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  // Sepolia Testnet
  11155111: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  // Mumbai (Polygon Testnet)
  80001: {
    chainId: '0x13881',
    chainName: 'Mumbai Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-mumbai.infura.io/v3/'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
};

// Request to switch to a specific network
export const switchToNetwork = async (chainId) => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not available');
  }
  
  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: supportedNetworks[chainId].chainId }],
    });
    return true;
  } catch (error) {
    // If the network is not added, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [supportedNetworks[chainId]],
        });
        return true;
      } catch (addError) {
        throw addError;
      }
    }
    throw error;
  }
};

// Request account access
export const requestAccounts = async () => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not available');
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error) {
    throw error;
  }
};

// Get currently connected accounts (without prompting)
export const getConnectedAccounts = async () => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not available');
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts;
  } catch (error) {
    throw error;
  }
};

// Get current network
export const getCurrentNetwork = async () => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not available');
  }
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error) {
    throw error;
  }
};

// Send transaction
export const sendTransaction = async (from, to, value) => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not available');
  }
  
  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from, to, value }],
    });
    return txHash;
  } catch (error) {
    throw error;
  }
};
