"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaWallet, 
  FaEthereum, 
  FaArrowLeft, 
  FaLink, 
  FaExchangeAlt, 
  FaNetworkWired, 
  FaExclamationTriangle,
  FaCopy,
  FaGasPump,
  FaHistory,
  FaChartPie,
  FaUserCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from "../../contexts/AuthContext";
import { useBlockchainWallet } from "../../contexts/BlockchainWalletContext";
import MetaMaskPrompt from "../../components/MetaMaskPrompt";
import NetworkSelector from "../../components/NetworkSelector";

export default function Wallet() {
  const { user, updateUserData } = useAuth();
  const { 
    account, 
    balance, 
    chainId, 
    provider,
    isConnecting, 
    error, 
    connectWallet,
    getNetworkName,
    sendTransaction,
    supportedNetworks
  } = useBlockchainWallet();
  
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [txStatus, setTxStatus] = useState(null);
  const [showSend, setShowSend] = useState(false);
  const [showMetaMaskPrompt, setShowMetaMaskPrompt] = useState(false);
  
  // New state variables for enhanced wallet details
  const [ensName, setEnsName] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [txHistory, setTxHistory] = useState(null);
  const [showTxHistory, setShowTxHistory] = useState(false);

  // Fetch wallet details when account connects or changes
  useEffect(() => {
    // Debug log to track wallet connection state
    console.log("Wallet connection state:", { 
      account, 
      balance, 
      chainId, 
      hasProvider: !!provider 
    });
    
    // Save wallet address to user data when connected
    const saveWalletToUserProfile = async () => {
      if (user?.uid && account && user?.walletAddress !== account) {
        try {
          await updateUserData(user.uid, { walletAddress: account });
        } catch (error) {
          console.error('Error saving wallet address:', error);
        }
      }
    };
    
    // Fetch additional wallet details
    const fetchWalletDetails = async () => {
      console.log("Attempting to fetch wallet details");
      if (!account) {
        console.log("Cannot fetch wallet details: No account connected");
        return;
      }
      
      // Always initialize transaction history if we have an account
      // This ensures the UI has something to show even if provider fails
      if (!txHistory) {
        console.log("Initializing transaction history with sample data");
        setTxHistory({
          recent: [
            { 
              hash: '0x3f5..a72',
              type: 'sent',
              amount: '0.05',
              to: '0x742...3c9',
              timestamp: Date.now() - 86400000,
              status: 'confirmed'
            },
            {
              hash: '0x8a2..b14',
              type: 'received',
              amount: '0.12',
              from: '0x593...2f1',
              timestamp: Date.now() - 172800000,
              status: 'confirmed'
            },
            {
              hash: '0x5c3..d97',
              type: 'sent',
              amount: '0.025',
              to: '0x901...7e5',
              timestamp: Date.now() - 259200000,
              status: 'confirmed'
            }
          ],
          pendingCount: 0
        });
      }
      
      if (!provider) {
        console.log("Cannot fetch additional wallet details: No provider available");
        // Continue with minimal UI even without provider
        return;
      }
      
      try {
        console.log("Fetching gas price...");
        // 1. Get gas price
        const currentGasPrice = await provider.getGasPrice();
        console.log("Gas price fetched:", currentGasPrice.toString());
        setGasPrice(currentGasPrice);
        
        // 2. Try to get ENS name (only works on mainnet)
        try {
          if (chainId === 1) { // Only on mainnet
            console.log("Attempting ENS lookup for account:", account);
            const name = await provider.lookupAddress(account);
            if (name) {
              console.log("ENS name found:", name);
              setEnsName(name);
            }
          }
        } catch (err) {
          console.log("ENS lookup not available:", err.message);
        }
        
        // 3. Simulate transaction history (for UI purposes - in real app would fetch from an API)
        // This is just mock data for display purposes
        setTxHistory({
          recent: [
            { 
              hash: '0x3f5..a72',
              type: 'sent',
              amount: '0.05',
              to: '0x742...3c9',
              timestamp: Date.now() - 86400000,
              status: 'confirmed'
            },
            {
              hash: '0x8a2..b14',
              type: 'received',
              amount: '0.12',
              from: '0x593...2f1',
              timestamp: Date.now() - 172800000,
              status: 'confirmed'
            },
            {
              hash: '0x5c3..d97',
              type: 'sent',
              amount: '0.025',
              to: '0x901...7e5',
              timestamp: Date.now() - 259200000,
              status: 'confirmed'
            }
          ],
          pendingCount: 0
        });
      } catch (err) {
        console.error("Error fetching wallet details:", err);
      }
    };
    
    if (account) {
      saveWalletToUserProfile();
      fetchWalletDetails();
    }
  }, [account, user, updateUserData, provider, chainId]);

  const handleConnectWallet = async () => {
    if (!user) {
      alert('Please sign in to connect your wallet');
      return;
    }
    
    // Check if MetaMask API is available
    if (typeof window !== 'undefined' && !window.ethereum) {
      setShowMetaMaskPrompt(true);
      return;
    }

    try {
      console.log("Attempting to connect wallet...");
      const result = await connectWallet();
      console.log("Wallet connection result:", result);
      
      // Manually trigger wallet details fetch after connection
      if (account && provider) {
        console.log("Manually triggering wallet details fetch after connection");
        try {
          // Get gas price
          const currentGasPrice = await provider.getGasPrice();
          setGasPrice(currentGasPrice);
          console.log("Gas price manually fetched:", currentGasPrice.toString());
          
          // Set transaction history (simulated)
          setTxHistory({
            recent: [
              { 
                hash: '0x3f5..a72',
                type: 'sent',
                amount: '0.05',
                to: '0x742...3c9',
                timestamp: Date.now() - 86400000,
                status: 'confirmed'
              },
              {
                hash: '0x8a2..b14',
                type: 'received',
                amount: '0.12',
                from: '0x593...2f1',
                timestamp: Date.now() - 172800000,
                status: 'confirmed'
              },
              {
                hash: '0x5c3..d97',
                type: 'sent',
                amount: '0.025',
                to: '0x901...7e5',
                timestamp: Date.now() - 259200000,
                status: 'confirmed'
              }
            ],
            pendingCount: 0
          });
          
          // Force a state update to trigger re-render
          console.log("Wallet details initialized. Account:", account, "Balance:", balance);
          
          // Notify the user for better UX
          if (account && !balance) {
            console.log("Warning: Account connected but balance not available. Network may be unsupported or MetaMask needs refresh.");
          }
        } catch (err) {
          console.error("Error in manual fetch of wallet details:", err);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  
  const handleCloseMetaMaskPrompt = () => {
    setShowMetaMaskPrompt(false);
  };
  
  // Copy wallet address to clipboard
  const copyAddressToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account)
        .then(() => {
          setCopiedAddress(true);
          setTimeout(() => setCopiedAddress(false), 3000);
        })
        .catch(err => console.error('Failed to copy address:', err));
    }
  };
  
  const handleSendTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !recipient) {
      setTxStatus({ error: 'Please enter both amount and recipient address' });
      return;
    }
    
    try {
      setTxStatus({ status: 'sending' });
      const tx = await sendTransaction(recipient, amount);
      setTxStatus({ 
        status: 'success', 
        hash: tx.hash,
        message: `Transaction sent! Hash: ${tx.hash}` 
      });
      
      // Reset form
      setAmount('');
      setRecipient('');
    } catch (error) {
      console.error('Transaction error:', error);
      setTxStatus({ 
        status: 'error', 
        error: error.message || 'Transaction failed' 
      });
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-guard">
      <MetaMaskPrompt show={showMetaMaskPrompt} onClose={handleCloseMetaMaskPrompt} />
      <div className="responsive-container max-w-lg mx-auto mt-12">
        <div className="card card-body flex flex-col items-center">
  <div className="text-center mb-6 section">
          <FaWallet className="text-3xl sm:text-4xl text-violet-600 dark:text-violet-400 mx-auto mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-slate-100">Blockchain Wallet</h2>
          {account && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {ensName ? ensName : `${account.slice(0, 6)}...${account.slice(-4)}`}
            </p>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="w-full p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl backdrop-blur-sm mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {!user ? (
          <div className="text-center mb-4 w-full">
            <p className="text-slate-700 dark:text-slate-300 mb-4">Please sign in to connect your wallet</p>
            <Link href="/signin" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 block w-full text-center">
              Sign In
            </Link>
          </div>
        ) : (
          <button 
            onClick={handleConnectWallet} 
            disabled={isConnecting}
            className="bg-violet-600 text-white px-4 py-3 rounded-xl hover:bg-violet-700 mb-4 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
          >
            {isConnecting ? (
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
                <span>Connect MetaMask</span>
              </>
            )}
          </button>
        )}

        {/* Wallet Debug Info */}
        <div className="w-full p-3 mb-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-xl text-blue-800 dark:text-blue-300 text-xs">
          <div className="mb-1 font-semibold">Connection State:</div>
          <div>Account: {account ? 'Connected' : 'Not Connected'}</div>
          <div>Balance: {balance ? `${parseFloat(balance).toFixed(6)} ETH` : 'Not Available'}</div>
          <div>Network ID: {chainId || 'Unknown'}</div>
          <div>Provider: {provider ? 'Available' : 'Not Available'}</div>
        </div>

        {/* Wallet Info */}
        {account && (
          <div className="w-full space-y-3">
            {/* Wallet Identity Section */}
            <div className="w-full p-4 bg-white dark:bg-indigo-900/30 backdrop-blur-md border border-slate-200 dark:border-indigo-700/50 rounded-xl flex flex-col">
              {/* ENS Name if available */}
              {ensName && (
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-violet-600 dark:text-violet-400" />
                    <span className="text-sm font-medium text-black dark:text-slate-200">{ensName}</span>
                  </div>
                </div>
              )}
              
              {/* Wallet Address with Copy */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Wallet Address:</span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-all">
                    {account}
                  </p>
                </div>
                <button 
                  onClick={copyAddressToClipboard}
                  className="p-2 hover:bg-white/30 dark:hover:bg-slate-800/30 rounded-full transition-colors"
                >
                  {copiedAddress ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaCopy className="text-slate-500 dark:text-slate-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Balance Card */}
            <div className="w-full p-4 bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-blue-700/50 rounded-xl flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-black dark:text-slate-400 font-medium">Total Balance:</span>
                <FaEthereum className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-black dark:text-slate-100">
                  {balance ? parseFloat(balance).toFixed(4) : '0.0000'}
                </p>
                <span className="text-sm text-slate-600 dark:text-slate-300">ETH</span>
              </div>
              {balance && parseFloat(balance) > 0 && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {/* This would be a real USD value in a production app */}
                  ≈ $${(parseFloat(balance) * 3450).toFixed(2)} USD
                </div>
              )}
            </div>
            
            {/* Network Info */}
            <div className="w-full p-3 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl flex items-center justify-between">
              <div>
                <span className="block text-xs text-black dark:text-slate-400 mb-1 font-medium">Network:</span>
                <NetworkSelector />
              </div>
              <FaNetworkWired className="text-violet-600 dark:text-violet-400" />
            </div>
            
            {/* Gas Price */}
            {gasPrice && (
              <div className="w-full p-3 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-xs text-black dark:text-slate-400 mb-1 font-medium">Current Gas Price:</span>
                  <p className="text-sm text-black dark:text-slate-300">
                    {parseFloat(gasPrice.toString()) / 1e9 > 1 
                      ? `${(parseFloat(gasPrice.toString()) / 1e9).toFixed(2)} Gwei` 
                      : `${(parseFloat(gasPrice.toString()) / 1e6).toFixed(2)} Mwei`}
                  </p>
                </div>
                <FaGasPump className="text-violet-600 dark:text-violet-400" />
              </div>
            )}
            
            {/* Actions Section */}
            <div className="w-full grid grid-cols-2 gap-3">
              {/* Send Transaction Button */}
              <button 
                onClick={() => setShowSend(!showSend)} 
                className="p-3 bg-violet-600 dark:bg-violet-600/20 text-white dark:text-violet-400 rounded-xl flex items-center justify-center gap-2 hover:bg-violet-700 dark:hover:bg-violet-600/30 transition-colors"
              >
                <FaExchangeAlt className="flex-shrink-0" />
                <span>{showSend ? 'Hide Send' : 'Send ETH'}</span>
              </button>
              
              {/* Transaction History Button */}
              <button 
                onClick={() => setShowTxHistory(!showTxHistory)} 
                className="p-3 bg-indigo-600 dark:bg-indigo-600/20 text-white dark:text-indigo-400 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-600/30 transition-colors"
              >
                <FaHistory className="flex-shrink-0" />
                <span>{showTxHistory ? 'Hide History' : 'Transactions'}</span>
              </button>
            </div>
            
            {/* Wallet Assets Section */}
            <div className="w-full p-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <h3 className="text-sm font-medium text-black dark:text-slate-300 mb-3 flex items-center gap-2">
                <FaChartPie className="text-indigo-600 dark:text-indigo-400" />
                Assets
              </h3>
              <div className="p-3 bg-white dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FaEthereum className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-slate-200">Ethereum</p>
                    <p className="text-xs text-black dark:text-slate-400">ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {balance ? parseFloat(balance).toFixed(4) : '0.0000'}
                  </p>
                  {balance && parseFloat(balance) > 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ${(parseFloat(balance) * 3450).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Transaction History */}
            {showTxHistory && txHistory && (
              <div className="w-full p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <FaHistory className="text-indigo-600 dark:text-indigo-400" />
                  Recent Transactions
                </h3>
                
                {txHistory.recent.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-3">
                    No transactions found
                  </p>
                ) : (
                  <div className="space-y-3">
                    {txHistory.recent.map((tx, index) => (
                      <div key={index} className="p-3 bg-white/30 dark:bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${
                            tx.type === 'received' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-orange-600 dark:text-orange-400'
                          }`}>
                            {tx.type === 'received' ? 'Received' : 'Sent'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {tx.amount} ETH
                          </span>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
                            {tx.status}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                          {tx.type === 'received' ? `From: ${tx.from}` : `To: ${tx.to}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-3 text-center">
                  <a href={`https://${chainId === 1 ? '' : chainId === 5 ? 'goerli.' : chainId === 11155111 ? 'sepolia.' : 'mumbai.'}etherscan.io/address/${account}`} 
                     target="_blank" 
                     rel="noreferrer" 
                     className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    View all transactions on Etherscan
                  </a>
                </div>
              </div>
            )}
            
            {/* Send Transaction Form */}
            {showSend && (
              <form onSubmit={handleSendTransaction} className="w-full p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Recipient Address:</label>
                  <input 
                    type="text"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-2 border border-white/20 dark:border-slate-700/50 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Amount (ETH):</label>
                  <input 
                    type="number"
                    placeholder="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.0001"
                    className="w-full p-2 border border-white/20 dark:border-slate-700/50 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={txStatus?.status === 'sending'}
                  className="w-full p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {txStatus?.status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </span>
                  ) : 'Send'}
                </button>
                
                {/* Transaction Status */}
                {txStatus && (
                  <div className={`p-2 rounded-lg text-sm ${
                    txStatus.status === 'success' 
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
                      : txStatus.status === 'error'
                      ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                      : ''
                  }`}>
                    {txStatus.status === 'success' ? (
                      <div>
                        <p>Transaction sent!</p>
                        <p className="text-xs break-all mt-1">Hash: {txStatus.hash}</p>
                      </div>
                    ) : txStatus.error ? (
                      <p>{txStatus.error}</p>
                    ) : null}
                  </div>
                )}
              </form>
            )}
          </div>
        )}
        
        {!account && !user && (
          <div className="w-full p-4 bg-violet-600/10 dark:bg-violet-600/20 rounded-xl mt-4">
            <p className="text-sm text-violet-700 dark:text-violet-400 text-center">
              Connect your MetaMask wallet to access DeFi services
            </p>
          </div>
        )}
        
        {/* Troubleshooting Section */}
        {account && !balance && (
          <div className="w-full p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-xl mt-4">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-500 mb-2">Troubleshooting</h3>
            <ul className="list-disc list-inside text-sm space-y-1 text-yellow-700 dark:text-yellow-400">
              <li>Wallet connected but details not showing? Try refreshing the page</li>
              <li>Ensure you're on a supported network (Ethereum, Goerli, Sepolia, Mumbai)</li>
              <li>Check MetaMask is unlocked and connected to this site</li>
              <li>Try disconnecting and reconnecting your wallet</li>
            </ul>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm font-medium hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors w-full"
            >
              Refresh Page
            </button>
          </div>
        )}
        
        <Link href="/" className="mt-6 text-indigo-600 dark:text-indigo-400 text-center hover:underline flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
          <FaArrowLeft className="flex-shrink-0" />
          <span>Back to Home</span>
        </Link>
        </div>
      </div>
    </main>
  );
}
