import { FaHeart, FaWallet } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
  <footer className="w-full overflow-guard">
      {/* Main footer content with logo and links */}
      <div className="bg-[#0F172A] py-4 sm:py-6">
        <div className="w-full max-w-2xl sm:max-w-4xl mx-auto px-2 sm:px-4 responsive-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            {/* Logo and mission */}
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <FaWallet className="text-[#3B82F6] text-lg" />
                <h3 className="text-base sm:text-lg font-bold text-white">DFI Wallet</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xs mx-auto md:mx-0">
                Digital Financial Inclusion for the Unbanked.
              </p>
            </div>
            
            {/* Links - grid for mobile, row for desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-2 sm:gap-x-4 sm:gap-y-4 md:flex md:flex-wrap md:justify-center md:gap-6 w-full md:w-auto">
              <Link href="/" className="text-white hover:text-[#3B82F6] transition-colors text-xs sm:text-sm text-center md:text-left min-w-[44px] py-2 rounded-lg">
                <span className="block py-1">Home</span>
              </Link>
              <Link href="/wallet" className="text-white hover:text-[#3B82F6] transition-colors text-xs sm:text-sm text-center md:text-left min-w-[44px] py-2 rounded-lg">
                <span className="block py-1">Wallet</span>
              </Link>
              <Link href="/verify" className="text-white hover:text-[#3B82F6] transition-colors text-xs sm:text-sm text-center md:text-left min-w-[44px] py-2 rounded-lg">
                <span className="block py-1">Verify</span>
              </Link>
              <Link href="/profile" className="text-white hover:text-[#3B82F6] transition-colors text-xs sm:text-sm text-center md:text-left min-w-[44px] py-2 rounded-lg">
                <span className="block py-1">Profile</span>
              </Link>
              
              <a href="#" className="text-white hover:text-[#3B82F6] transition-colors text-xs sm:text-sm text-center md:text-left min-w-[44px] py-2 rounded-lg">
                <span className="block py-1">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright section - blue to match screenshot */}
      <div className="bg-[#3B82F6] py-2">
        <div className="w-full max-w-2xl sm:max-w-4xl mx-auto px-2 sm:px-4 flex flex-col md:flex-row justify-between items-center text-pretty responsive-container">
          <div className="text-center md:text-left text-xs text-white mb-2 md:mb-0">
            © {new Date().getFullYear()} Digital Financial Inclusion
          </div>
          <div className="text-xs text-white flex items-center justify-center">
            <span>Made with</span>
            <FaHeart className="mx-1 inline text-red-400" />
            <span>using Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
