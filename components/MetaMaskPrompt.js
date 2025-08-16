"use client";
import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaDownload, FaExternalLinkAlt, FaWallet } from 'react-icons/fa';

export default function MetaMaskPrompt({ show, onClose }) {
  const [metamaskAvailable, setMetamaskAvailable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if MetaMask API is available
    const checkMetaMaskAPI = () => {
      if (typeof window !== 'undefined') {
        setMetamaskAvailable(!!window.ethereum);
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      }
    };
    
    checkMetaMaskAPI();
  }, []);

  if (!show) return null;
  
  // If MetaMask API is available, don't show the prompt
  if (metamaskAvailable) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl max-w-md w-full m-4 relative">
        <div className="absolute top-3 right-3">
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <FaWallet className="text-violet-500 text-xl mr-2" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blockchain Wallet Access</h2>
        </div>
        
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          To use the blockchain wallet feature, you need a wallet provider like MetaMask that supports the Ethereum API.
        </p>
        
        {isMobile ? (
          <div className="mb-4">
            <p className="text-slate-700 dark:text-slate-300 mb-2">Options for mobile:</p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
              <li>Use the MetaMask mobile app with browser</li>
              <li>Try Trust Wallet or another mobile Ethereum wallet</li>
              <li>Use a desktop browser with MetaMask extension</li>
            </ul>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-slate-700 dark:text-slate-300 mb-2">Options for desktop:</p>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
              <li>Install MetaMask browser extension</li>
              <li>Use Brave browser with built-in wallet</li>
              <li>Try another Ethereum-compatible wallet</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-violet-600 text-white px-4 py-3 rounded-xl hover:bg-violet-700 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <FaWallet />
            <span>Get a Wallet</span>
            <FaExternalLinkAlt className="h-3 w-3" />
          </a>
          
          <button
            onClick={onClose}
            className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Continue Without Wallet
          </button>
        </div>
        
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
          We use the Ethereum provider API for secure wallet connections
        </p>
      </div>
    </div>
  );
}
