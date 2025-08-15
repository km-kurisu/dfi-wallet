"use client";
import { useState } from 'react';
import Link from "next/link";
import ThemeToggle from './ThemeToggle';
import { FaHome, FaUserPlus, FaWallet, FaIdCard, FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-2xl bg-white/20 dark:bg-slate-900/20 border-b border-white/20 dark:border-slate-800/30 shadow-2xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <FaWallet className="text-indigo-600 dark:text-indigo-400" />
          DFI Wallet
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/" className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1">
            <FaHome className="text-sm" />
            Home
          </Link>
          {!user ? (
            <>
              <Link href="/onboarding" className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1">
                <FaUserPlus className="text-sm" />
                Onboarding
              </Link>
              <Link href="/signin" className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1">
                <FaSignInAlt className="text-sm" />
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link href="/wallet" className="text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition flex items-center gap-1">
                <FaWallet className="text-sm" />
                Wallet
              </Link>
              <Link href="/verify" className="text-slate-700 dark:text-slate-200 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition flex items-center gap-1">
                <FaIdCard className="text-sm" />
                Verify
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FaUser className="text-sm" />
                  {user.displayName || user.email}
                </span>
                <button 
                  onClick={logout}
                  className="text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-1"
                >
                  <FaSignOutAlt className="text-sm" />
                  Logout
                </button>
              </div>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden gap-3">
          <ThemeToggle />
          <button 
            aria-label="Toggle menu" 
            onClick={() => setOpen(!open)} 
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div className={`md:hidden fixed inset-x-0 top-[61px] transform ${open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} transition-all duration-300 ease-in-out z-50`}>
        <div className="px-4 py-4 space-y-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-b border-white/20 dark:border-slate-800/30 shadow-xl">
          <Link 
            href="/" 
            className="flex items-center gap-2 p-3 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all"
            onClick={() => setOpen(false)}
          >
            <FaHome className="text-indigo-600 dark:text-indigo-400" />
            <span>Home</span>
          </Link>
          
          {!user ? (
            <>
              <Link 
                href="/onboarding" 
                className="flex items-center gap-2 p-3 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all"
                onClick={() => setOpen(false)}
              >
                <FaUserPlus className="text-indigo-600 dark:text-indigo-400" />
                <span>Onboarding</span>
              </Link>
              <Link 
                href="/signin" 
                className="flex items-center gap-2 p-3 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all"
                onClick={() => setOpen(false)}
              >
                <FaSignInAlt className="text-indigo-600 dark:text-indigo-400" />
                <span>Sign In</span>
              </Link>
            </>
          ) : (
            <>
              {/* User info at top of mobile menu when logged in */}
              <div className="flex items-center gap-3 p-3 mb-2 border-b border-slate-200/30 dark:border-slate-800/30 pb-4">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-full w-10 h-10 flex items-center justify-center">
                  <FaUser className="text-slate-700 dark:text-slate-300" />
                </div>
                <div className="truncate">
                  <div className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {user.isVerified ? 'Verified Account' : 'Verification Pending'}
                  </div>
                </div>
              </div>
              
              <Link 
                href="/wallet" 
                className="flex items-center gap-2 p-3 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all"
                onClick={() => setOpen(false)}
              >
                <FaWallet className="text-violet-600 dark:text-violet-400" />
                <span>Wallet</span>
              </Link>
              <Link 
                href="/verify" 
                className="flex items-center gap-2 p-3 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all"
                onClick={() => setOpen(false)}
              >
                <FaIdCard className="text-fuchsia-600 dark:text-fuchsia-400" />
                <span>Verify</span>
              </Link>
              <button 
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 p-3 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-red-100/70 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all text-left"
              >
                <FaSignOutAlt className="text-red-600 dark:text-red-400" />
                <span>Logout</span>
              </button>
            </>
          )}
          
          {/* Close button at bottom */}
          <button 
            onClick={() => setOpen(false)}
            className="mt-3 w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-slate-300/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-400"
          >
            Close Menu
          </button>
        </div>
      </div>
    </nav>
  );
}
