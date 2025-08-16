"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaWallet, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaPen, 
  FaExternalLinkAlt,
  FaEthereum,
  FaCalendarAlt,
  FaKey,
  FaNetworkWired,
  FaCopy,
  FaUserCircle
} from 'react-icons/fa';
import { useAuth } from "../../contexts/AuthContext";
import { useBlockchainWallet } from "../../contexts/BlockchainWalletContext";

export default function Profile() {
  const router = useRouter();
  const { user, updateUserData, loading: authLoading, logout } = useAuth();
  const { 
    account, 
    balance, 
    chainId, 
    getNetworkName,
    isConnecting
  } = useBlockchainWallet();

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    displayName: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [authLoading, user, router]);

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setEditableData({
        displayName: user.displayName || ''
      });
    }
  }, [user]);

  // Function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editableData.displayName.trim()) {
      setEditError('Display name cannot be empty');
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      const result = await updateUserData(user.uid, {
        displayName: editableData.displayName
      });

      if (result.success) {
        setIsEditing(false);
      } else {
        setEditError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setEditError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/signin');
    }
  };

  // If loading or no user, show loading
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
          <p className="text-center mt-4 text-black dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-3xl mt-12 mb-8">
        {/* Profile Header */}
        <div className="relative w-full p-6 sm:p-8 bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaUserCircle className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
              )}
            </div>
            <div className="flex-grow">
              {isEditing ? (
                <div>
                  <input 
                    type="text" 
                    name="displayName"
                    value={editableData.displayName}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border border-violet-300 dark:border-violet-700 rounded-lg bg-white/80 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Display Name"
                  />
                  {editError && (
                    <p className="text-sm text-red-500 mb-2">{editError}</p>
                  )}
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center space-x-1 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save</span>
                      )}
                    </button>
                    <button 
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-slate-500 dark:bg-slate-800/30 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {user.displayName || 'User'}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
                    {user.email}
                  </p>
                </>
              )}
              
              <div className="flex items-center mt-4">
                <div className="flex items-center space-x-2 mr-4">
                  <div className={`w-3 h-3 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user.isVerified ? 'Verified User' : 'Not Verified'}
                  </span>
                </div>
                {account && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Wallet Connected
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <button 
                onClick={handleEditToggle}
                className="absolute top-4 right-4 p-2 bg-indigo-600/80 dark:bg-slate-800/30 rounded-lg hover:bg-indigo-600 dark:hover:bg-slate-800/50 transition-colors"
              >
                <FaPen className="text-white dark:text-indigo-400" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-black dark:text-slate-100 mb-4 flex items-center">
                <FaUser className="mr-2 text-indigo-500 dark:text-indigo-400" />
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-black dark:text-slate-400">Display Name</p>
                  <p className="text-black dark:text-slate-200">{user.displayName || 'Not set'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-black dark:text-slate-400">Email</p>
                  <p className="text-black dark:text-slate-200">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Account Created</p>
                  <p className="text-slate-800 dark:text-slate-200">{user.createdAt ? formatDate(user.createdAt) : 'Unknown'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Account Type</p>
                  <p className="text-slate-800 dark:text-slate-200">{user.provider ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1) : 'Email'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-slate-300 rounded-lg text-sm transition-colors"
              >
                Log Out
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-lg mt-6">
              <h2 className="text-lg font-semibold text-black dark:text-slate-100 mb-4 flex items-center">
                <FaIdCard className="mr-2 text-indigo-500 dark:text-indigo-400" />
                Verification Status
              </h2>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  {user.isVerified ? (
                    <>
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Not Verified</span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {user.isVerified 
                    ? 'Your identity has been verified. You have full access to all features.' 
                    : 'Complete verification to unlock all features of the platform.'}
                </p>
              </div>

              {!user.isVerified && (
                <Link href="/verify" className="block w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg transition-colors">
                  Complete Verification
                </Link>
              )}
            </div>
          </div>

          {/* Wallet and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Section */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-black dark:text-slate-100 mb-4 flex items-center">
                <FaWallet className="mr-2 text-indigo-500 dark:text-indigo-400" />
                Blockchain Wallet
              </h2>

              {account ? (
                <div>
                  <div className="p-4 bg-white dark:bg-indigo-900/30 backdrop-blur-md border border-slate-200 dark:border-indigo-700/50 rounded-xl mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-black dark:text-slate-400">Total Balance</p>
                      <FaEthereum className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-bold text-black dark:text-slate-100">
                        {balance ? parseFloat(balance).toFixed(4) : '0.0000'}
                      </p>
                      <span className="text-sm text-slate-600 dark:text-slate-400">ETH</span>
                    </div>
                    {balance && parseFloat(balance) > 0 && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        ≈ $${(parseFloat(balance) * 3450).toFixed(2)} USD
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">Wallet Address</span>
                      <div className="flex items-center justify-between bg-white/30 dark:bg-slate-800/30 p-2 rounded-lg">
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-all">
                          {account}
                        </p>
                        <button 
                          onClick={copyAddressToClipboard}
                          className="p-2 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-full transition-colors flex-shrink-0 ml-2"
                        >
                          {copiedAddress ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaCopy className="text-slate-500 dark:text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">Network</span>
                      <div className="bg-white/30 dark:bg-slate-800/30 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FaNetworkWired className="text-indigo-500 dark:text-indigo-400" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {chainId ? getNetworkName() : 'Not Connected'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link 
                        href="/wallet" 
                        className="block w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg transition-colors"
                      >
                        Manage Wallet
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                  <FaWallet className="mx-auto text-4xl text-slate-400 dark:text-slate-600 mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">No wallet connected</p>
                  <Link 
                    href="/wallet" 
                    className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg transition-colors"
                  >
                    Connect Wallet
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-black dark:text-slate-100 mb-4 flex items-center">
                <FaClock className="mr-2 text-indigo-500 dark:text-indigo-400" />
                Recent Activity
              </h2>

              {account ? (
                <div className="space-y-4">
                  {/* This would be real transaction data in a production app */}
                  <div className="p-4 bg-white dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                          <FaEthereum className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-black dark:text-slate-100">Received ETH</p>
                          <p className="text-sm text-black dark:text-slate-400">From: 0x7a2...4b8</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600 dark:text-green-400">+0.12 ETH</p>
                        <p className="text-xs text-black dark:text-slate-400">2 days ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/30 dark:bg-slate-700/30 border border-slate-200/50 dark:border-slate-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
                          <FaEthereum className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium text-black dark:text-slate-100">Sent ETH</p>
                          <p className="text-sm text-black dark:text-slate-400">To: 0x9c1...7e5</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-600 dark:text-orange-400">-0.025 ETH</p>
                        <p className="text-xs text-black dark:text-slate-400">3 days ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/30 dark:bg-slate-700/30 border border-slate-200/50 dark:border-slate-600/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                          <FaKey className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">Wallet Connected</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">First connection</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">1 week ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link 
                      href={`https://${chainId === 1 ? '' : chainId === 5 ? 'goerli.' : chainId === 11155111 ? 'sepolia.' : 'mumbai.'}etherscan.io/address/${account}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>View all transactions</span>
                      <FaExternalLinkAlt className="ml-1 text-xs" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                  <p className="text-slate-600 dark:text-slate-400">
                    Connect your wallet to see transaction history
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
