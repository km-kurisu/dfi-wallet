"use client";
import { useState } from 'react';
import { FaChevronDown, FaSync } from 'react-icons/fa';
import { useBlockchainWallet } from '../contexts/BlockchainWalletContext';

export default function NetworkSelector() {
  const { chainId, switchNetwork, supportedNetworks, isConnecting } = useBlockchainWallet();
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter to show only the supported networks
  const availableNetworks = Object.keys(supportedNetworks).map(id => ({
    id: parseInt(id),
    ...supportedNetworks[id]
  }));
  
  // Handle network change
  const handleNetworkChange = async (networkId) => {
    setIsOpen(false);
    if (networkId === chainId) return;
    
    try {
      await switchNetwork(networkId);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };
  
  // Get current network details
  const getCurrentNetwork = () => {
    if (!chainId) return { name: 'Not Connected', color: 'gray' };
    
    const networkColors = {
      1: 'text-blue-600 dark:text-blue-400',
      5: 'text-yellow-600 dark:text-yellow-400',
      11155111: 'text-purple-600 dark:text-purple-400',
      80001: 'text-pink-600 dark:text-pink-400',
      default: 'text-gray-600 dark:text-gray-400'
    };
    
    const networkName = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      80001: 'Mumbai Testnet',
    }[chainId] || `Chain ID: ${chainId}`;
    
    return { 
      name: networkName, 
      color: networkColors[chainId] || networkColors.default 
    };
  };
  
  const currentNetwork = getCurrentNetwork();
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isConnecting}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className={`w-2 h-2 rounded-full bg-current ${currentNetwork.color}`}></div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {currentNetwork.name}
        </span>
        {isConnecting ? (
          <FaSync className="animate-spin text-sm text-slate-500" />
        ) : (
          <FaChevronDown className={`text-xs text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-white/20 dark:border-slate-700/50 py-1 z-50">
          {availableNetworks.map(network => (
            <button
              key={network.id}
              onClick={() => handleNetworkChange(network.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                network.id === chainId ? 'font-medium bg-slate-100 dark:bg-slate-700' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-current ${
                  network.id === 1 ? 'text-blue-600 dark:text-blue-400' :
                  network.id === 5 ? 'text-yellow-600 dark:text-yellow-400' :
                  network.id === 11155111 ? 'text-purple-600 dark:text-purple-400' :
                  network.id === 80001 ? 'text-pink-600 dark:text-pink-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}></div>
                <span>{network.chainName}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
