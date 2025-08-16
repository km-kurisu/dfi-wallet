"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  isMetaMaskAvailable,
  supportedNetworks,
  switchToNetwork,
  requestAccounts,
  getConnectedAccounts,
  getCurrentNetwork
} from "../lib/metamask";

const BlockchainWalletContext = createContext();

export function useBlockchainWallet() {
  return useContext(BlockchainWalletContext);
}

export function BlockchainWalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize and detect MetaMask API on component mount
  useEffect(() => {
    const initializeProvider = async () => {
      try {
        // Check if ethereum object exists directly (MetaMask API)
        if (typeof window !== 'undefined' && window.ethereum) {
          // Check if we're dealing with MetaMask specifically
          const isMetaMask = window.ethereum.isMetaMask;
          
          // Set up provider
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(ethersProvider);
          
          console.log(`MetaMask ${isMetaMask ? 'detected' : 'not detected, but compatible provider found'}`);
          
          // Check if already connected (without prompting)
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const connectedAccount = accounts[0];
            setAccount(connectedAccount);
            
            // Get account balance
            const accountBalance = await ethersProvider.getBalance(connectedAccount);
            setBalance(ethers.utils.formatEther(accountBalance));
            
            // Get network information
            const network = await ethersProvider.getNetwork();
            setChainId(network.chainId);
            
            console.log(`Connected to account: ${connectedAccount}`);
            console.log(`Network: ${network.name} (${network.chainId})`);
          } else {
            console.log("No accounts connected yet. User will need to connect manually.");
          }
        } else {
          // If MetaMask API isn't available, prepare fallback approach
          console.log("No Ethereum provider detected. MetaMask or compatible wallet is required.");
        }
      } catch (err) {
        console.error("Error initializing provider:", err);
      }
    };

    initializeProvider();
  }, []);

  // Set up event listeners for MetaMask
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        setAccount(null);
        setBalance(null);
      } else {
        // Account changed
        setAccount(accounts[0]);
        
        if (provider) {
          const accountBalance = await provider.getBalance(accounts[0]);
          setBalance(ethers.utils.formatEther(accountBalance));
        }
      }
    };

    const handleChainChanged = (chainIdHex) => {
      // Convert hex chainId to decimal
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      window.location.reload(); // MetaMask recommends reloading on chain change
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [provider]);

  // Connect to MetaMask wallet using direct API
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    console.log("Starting wallet connection process...");
    
    try {
      // Check if ethereum object exists (MetaMask API)
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log("MetaMask API available, requesting accounts...");
        // Request account access directly using the MetaMask API
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Accounts received:", accounts);
        
        if (accounts.length > 0) {
          const connectedAccount = accounts[0];
          console.log("Connected to account:", connectedAccount);
          setAccount(connectedAccount);
          
          // Create ethers provider to work with the connected account
          console.log("Creating ethers provider...");
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(ethersProvider);
          
          // Get account balance
          console.log("Fetching account balance...");
          const accountBalance = await ethersProvider.getBalance(connectedAccount);
          const formattedBalance = ethers.utils.formatEther(accountBalance);
          console.log("Account balance:", formattedBalance, "ETH");
          setBalance(formattedBalance);
          
          // Get network information
          console.log("Fetching network information...");
          const network = await ethersProvider.getNetwork();
          console.log("Network:", network.name, "(Chain ID:", network.chainId, ")");
          setChainId(network.chainId);
          
          return {
            success: true,
            account: connectedAccount,
            balance: formattedBalance,
            chainId: network.chainId
          };
        } else {
          console.log("No accounts received after permission");
          throw new Error("No accounts received after permission");
        }
      } else {
        console.log("MetaMask API not available");
        throw new Error("MetaMask API not available. Please install MetaMask extension or use a compatible browser.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      if (err.code === 4001) {
        // User rejected request
        setError("Connection rejected. Please approve the connection request in MetaMask.");
      } else {
        setError(err.message || "Failed to connect to wallet");
      }
      return { success: false, error: err.message };
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet (for UI purposes - MetaMask doesn't support programmatic disconnection)
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setChainId(null);
  };

  // Send transaction using MetaMask's API directly
  const sendTransaction = async (to, amount) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    try {
      // Convert amount to wei (hex string)
      const amountInWei = ethers.utils.parseEther(amount.toString()).toHexString();
      
      // Use MetaMask's API to send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: to,
          value: amountInWei,
        }],
      });
      
      // Create a transaction response object with the hash
      const tx = {
        hash: txHash,
        wait: async () => {
          if (provider) {
            return await provider.waitForTransaction(txHash);
          }
          return { hash: txHash };
        }
      };
      
      return tx;
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  };

  // Get network name from chainId
  // Get network name and provide a function to switch networks
  const getNetworkName = () => {
    if (!chainId) return 'Not Connected';
    
    const networks = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
      56: 'Binance Smart Chain',
      97: 'BSC Testnet',
      42161: 'Arbitrum One',
      421613: 'Arbitrum Goerli',
      10: 'Optimism',
      420: 'Optimism Goerli',
      43114: 'Avalanche C-Chain',
      43113: 'Avalanche Fuji Testnet'
    };
    
    return networks[chainId] || `Unknown Network (${chainId})`;
  };
  
  // Switch to a specific network
  const switchNetwork = async (targetChainId) => {
    if (!account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      setIsConnecting(true);
      await switchToNetwork(targetChainId);
      
      // Network info will be updated via the chainChanged event handler
      return true;
    } catch (err) {
      console.error("Error switching network:", err);
      setError(`Failed to switch network: ${err.message}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const value = {
    account,
    balance,
    chainId,
    provider,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    getNetworkName,
    switchNetwork,
    isMetaMaskAvailable: typeof window !== 'undefined' ? isMetaMaskAvailable() : false,
    supportedNetworks
  };

  return (
    <BlockchainWalletContext.Provider value={value}>
      {children}
    </BlockchainWalletContext.Provider>
  );
}
