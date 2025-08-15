"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaWallet, FaEthereum, FaArrowLeft, FaLink } from 'react-icons/fa';
import { useAuth } from "../../contexts/AuthContext";

export default function Wallet() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, updateUserData } = useAuth();

  useEffect(() => {
    // Load saved wallet address from user data
    if (user?.walletAddress) {
      setAccount(user.walletAddress);
    }
  }, [user]);

  const connectWallet = async () => {
    if (!user) {
      alert('Please sign in to connect your wallet');
      return;
    }

    if (window.ethereum) {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        setAccount(walletAddress);
        
        // Save wallet address to Firebase
        await updateUserData(user.uid, { walletAddress });
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
      } finally {
        setLoading(false);
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask to use this feature.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-[340px] sm:max-w-md bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col items-center">
  <div className="text-center mb-6">
    <FaWallet className="text-3xl sm:text-4xl text-violet-600 dark:text-violet-400 mx-auto mb-2" />
    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Blockchain Wallet</h2>
  </div>
  {!user ? (
    <div className="text-center mb-4">
      <p className="text-slate-700 dark:text-slate-300 mb-4">Please sign in to connect your wallet</p>
      <Link href="/signin" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Sign In
      </Link>
    </div>
  ) : (
    <button 
      onClick={connectWallet} 
      disabled={loading}
      className="bg-violet-600 text-white px-4 py-3 rounded-lg hover:bg-violet-700 mb-4 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Connecting...</span>
        </>
      ) : account ? (
        <>
          <FaEthereum className="flex-shrink-0" />
          <span className="truncate">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
        </>
      ) : (
        <>
          <FaLink className="flex-shrink-0" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  )}
  {account && (
    <div className="w-full p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg mb-4">
      <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-all">
        <span className="block text-slate-500 dark:text-slate-400 mb-1">Wallet Address:</span>
        {account}
      </p>
    </div>
  )}
  <Link href="/" className="mt-6 text-indigo-600 dark:text-indigo-400 text-center hover:underline flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
    <FaArrowLeft className="flex-shrink-0" />
    <span>Back to Home</span>
  </Link>
      </div>
    </main>
  );
}
