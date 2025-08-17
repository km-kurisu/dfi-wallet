"use client";
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import ThemeToggle from './ThemeToggle';
import { FaHome, FaUserPlus, FaWallet, FaIdCard, FaSignInAlt, FaUser, FaSignOutAlt, FaChartPie } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  
  // Handle clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    // Lock/unlock body scroll
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-2xl glass border-b shadow-2xl">
      <div className="w-full max-w-2xl sm:max-w-4xl mx-auto flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
  <Link href="/" className="brand-text text-base sm:text-lg md:text-xl flex items-center gap-2">
          <FaWallet className="text-primary" />
          DFI Wallet
        </Link>

        {/* Desktop links */}
  <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Link href="/" className="nav-link flex items-center gap-1 min-w-[44px] py-2 rounded-lg text-xs sm:text-sm">
            <FaHome className="text-sm" />
            Home
          </Link>
          {!user ? (
            <>
              <Link href="/onboarding" className="nav-link flex items-center gap-1 min-w-[44px] py-2 rounded-lg text-xs sm:text-sm">
                <FaUserPlus className="text-sm" />
                Onboarding
              </Link>
              <Link href="/signin" className="nav-link flex items-center gap-1 min-w-[44px] py-2 rounded-lg text-xs sm:text-sm">
                <FaSignInAlt className="text-sm" />
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link href="/wallet" className="nav-link flex items-center gap-1 min-w-[44px] py-2 rounded-lg text-xs sm:text-sm">
                <FaWallet className="text-sm" />
                Wallet
              </Link>
              <Link href="/verify" className="nav-link flex items-center gap-1 min-w-[44px] py-2 rounded-lg text-xs sm:text-sm">
                <FaIdCard className="text-sm" />
                Verify
              </Link>
              <Link href="/market-analysis" className="nav-link flex items-center gap-1 min-w-[44px] py-2 rounded-lg text-xs sm:text-sm">
                <FaChartPie className="text-sm" />
                Market Analysis
              </Link>
              <div className="relative group">
                <button className="nav-link flex items-center gap-1 focus:outline-none min-w-[44px] py-2 rounded-lg text-xs sm:text-sm">
                  <FaUser className="text-sm" />
                  Profile
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                  <Link href="/profile" className="block px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-t-lg">Profile</Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-b-lg"
                  >
                    <FaSignOutAlt className="inline mr-2" />Logout
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden">
          <button 
            aria-label="Toggle menu" 
            onClick={() => setOpen(!open)} 
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition min-w-[44px]"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Backdrop for mobile menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-slate-700/90 dark:bg-black/90 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ zIndex: 40 }}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu with animation */}
      <div 
        ref={menuRef}
        className={`md:hidden fixed inset-x-0 top-[61px] transform ${open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'} transition-all duration-300 ease-in-out z-50`}>
        <div className="mobile-menu px-2 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3 shadow-2xl">
          {/* Brand at the top of mobile menu */}
          <div className="flex justify-between items-center mb-2 pb-2 border-b">
            <div className="brand-text text-base sm:text-lg flex items-center gap-2">
              <FaWallet className="text-primary" />
              DFI Wallet
            </div>
            <ThemeToggle />
          </div>
          
          {user && (
            /* User info at top of mobile menu when logged in */
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 mb-2 bg-primary rounded-lg">
              <div className="bg-white dark:bg-primary-dark rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md">
                <FaUser className="text-primary dark:text-primary-light" />
              </div>
              <div className="truncate">
                <div className="font-medium text-white truncate max-w-[120px] sm:max-w-[200px] text-xs sm:text-sm">
                  {user.displayName || user.email}
                </div>
                <div className="text-xs text-primary-light">
                  {user.isVerified ? 'Verified Account' : 'Verification Pending'}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Links */}
          <div className="space-y-1 sm:space-y-2 py-1">
            <Link 
              href="/" 
              className="mobile-menu-link flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all text-xs sm:text-sm min-w-[44px]"
              onClick={() => setOpen(false)}
            >
              <FaHome className="text-white" />
              <span className="font-medium">Home</span>
            </Link>
            
            {!user ? (
              <>
                <Link 
                  href="/onboarding" 
                  className="mobile-menu-link flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all text-xs sm:text-sm min-w-[44px]"
                  onClick={() => setOpen(false)}
                >
                  <FaUserPlus className="text-white" />
                  <span className="font-medium">Onboarding</span>
                </Link>
                <Link 
                  href="/signin" 
                  className="mobile-menu-link flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all text-xs sm:text-sm min-w-[44px]"
                  onClick={() => setOpen(false)}
                >
                  <FaSignInAlt className="text-white" />
                  <span className="font-medium">Sign In</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/wallet" 
                  className="mobile-menu-link-secondary flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all text-xs sm:text-sm min-w-[44px]"
                  onClick={() => setOpen(false)}
                >
                  <FaWallet className="text-white" />
                  <span className="font-medium">Wallet</span>
                </Link>
                <Link 
                  href="/verify" 
                  className="mobile-menu-link-secondary flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all text-xs sm:text-sm min-w-[44px]"
                  onClick={() => setOpen(false)}
                >
                  <FaIdCard className="text-white" />
                  <span className="font-medium">Verify</span>
                </Link>
                <Link 
                  href="/profile" 
                  className="mobile-menu-link-secondary flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all text-xs sm:text-sm min-w-[44px]"
                  onClick={() => setOpen(false)}
                >
                  <FaUser className="text-white" />
                  <span className="font-medium">Profile</span>
                </Link>
                <Link 
                  href="/market-analysis" 
                  className="mobile-menu-link-secondary flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-all text-xs sm:text-sm min-w-[44px]"
                  onClick={() => setOpen(false)}
                >
                  <FaChartPie className="text-white" />
                  <span className="font-medium">Market Analysis</span>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all text-left text-xs sm:text-sm min-w-[44px]"
                >
                  <FaSignOutAlt className="text-white" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
          
          {/* Close button at bottom */}
          <button 
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-3 sm:mt-4 w-full flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[44px]"
          >
            Close Menu
          </button>
        </div>
      </div>
    </nav>
  );
}
