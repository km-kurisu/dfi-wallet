export default function Footer() {
  return (
    <footer className="w-full bg-white/70 dark:bg-slate-900/70 border-t border-slate-200/20 dark:border-slate-800/40 text-center py-6 mt-12 text-sm text-slate-700 dark:text-slate-300 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <span className="block text-xs sm:text-sm md:text-base">© {new Date().getFullYear()} Digital Financial Inclusion for the Unbanked. All rights reserved.</span>
        <span className="block mt-2 text-xs sm:text-sm opacity-70">Made with Next.js & Tailwind CSS</span>
        
        {/* Mobile-friendly footer links */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
