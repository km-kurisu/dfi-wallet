"use client";
import { useEffect } from "react";
import Link from "next/link";
import { FaUserPlus, FaWallet, FaIdCard, FaReact, FaCss3Alt, FaEthereum, FaMobile, FaHome } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFramer } from 'react-icons/si';
import HomeRedirect from "./HomeRedirect";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  // Allow the user to set this page as their home
  const setAsHome = () => {
    localStorage.setItem('skipHomeRedirect', 'true');
    // Give feedback to the user
    alert('Home page set as your default landing page!');
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <HomeRedirect />
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        
        {/* Home preference setting for logged in users */}
        {/* Sticky CTA bar under the navbar - mobile responsive */}
        <div className="sticky top-16 z-40 flex justify-center py-3">
          <nav className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-xl p-2 sm:p-3 shadow-2xl">
            <Link href="/onboarding" className="px-3 py-2 bg-indigo-600 text-white text-sm sm:text-base rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors">
              <FaUserPlus className="flex-shrink-0" />
              <span>Get Started</span>
            </Link>
            <Link href="/wallet" className="px-3 py-2 bg-violet-600 text-white text-sm sm:text-base rounded-lg hover:bg-violet-700 flex items-center gap-2 transition-colors">
              <FaWallet className="flex-shrink-0" />
              <span>Wallet</span>
            </Link>
            <Link href="/verify" className="px-3 py-2 bg-fuchsia-600 text-white text-sm sm:text-base rounded-lg hover:bg-fuchsia-700 flex items-center gap-2 transition-colors">
              <FaIdCard className="flex-shrink-0" />
              <span className="whitespace-nowrap">ID Verify</span>
            </Link>
          </nav>
        </div>

        <header className="my-8 sm:my-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">Digital Financial Inclusion for the Unbanked</h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">Mobile-first wallets, lightweight blockchain integration, and privacy-preserving digital identity verification to reduce onboarding friction for underserved populations.</p>
        </header>

  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="p-4 sm:p-6 rounded-2xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-2xl transition-transform hover:scale-[1.01]">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Project overview</h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">This project demonstrates a practitioner-ready front-end that combines mobile-friendly UX, wallet connectivity (MetaMask), and a mock identity verification flow. The goal is to make basic financial services accessible to people without traditional banking.</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-2xl transition-transform hover:scale-[1.01]">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Key features</h2>
            <ul className="list-disc pl-5 text-sm sm:text-base text-slate-700 dark:text-slate-300 space-y-1">
              <li>Onboarding form with minimal fields and progressive verification.</li>
              <li>Blockchain wallet connect (MetaMask) for secure payments/identity anchors.</li>
              <li>Digital identity verification mock (file upload + status) to illustrate flow.</li>
              <li>Dark/light theme with accessible colors and glass UI elements.</li>
            </ul>
          </div>
        </section>

  <section className="mb-8 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Technology stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-xl transition-all hover:bg-white/30 dark:hover:bg-slate-900/30">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <SiNextdotjs className="text-xl sm:text-2xl text-slate-900 dark:text-slate-100" />
                <strong className="text-sm sm:text-base">Framework</strong>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">Next.js (App Router, JavaScript)</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-xl transition-all hover:bg-white/30 dark:hover:bg-slate-900/30">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <SiTailwindcss className="text-xl sm:text-2xl text-slate-900 dark:text-slate-100" />
                <strong className="text-sm sm:text-base">Styling</strong>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">Tailwind CSS (class-based dark mode)</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-xl transition-all hover:bg-white/30 dark:hover:bg-slate-900/30">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <FaEthereum className="text-xl sm:text-2xl text-slate-900 dark:text-slate-100" />
                <strong className="text-sm sm:text-base">Wallet</strong>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">MetaMask/Ethereum via window.ethereum</p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-xl transition-all hover:bg-white/30 dark:hover:bg-slate-900/30">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <SiFramer className="text-xl sm:text-2xl text-slate-900 dark:text-slate-100" />
                <strong className="text-sm sm:text-base">Other</strong>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">Framer Motion for animation (optional), PostCSS configuration for Tailwind</p>
            </div>
          </div>
        </section>

        <section className="mb-8 sm:mb-12 bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-xl p-4 sm:p-6 shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">How to try it</h3>
          <ol className="list-decimal pl-5 sm:pl-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 space-y-2">
            <li>Open <strong>Get Started</strong> to simulate onboarding and identity verification.</li>
            <li>Use <strong>Wallet</strong> to connect MetaMask (or a browser wallet) to test account flows.</li>
            <li>Toggle theme using the floating button or navbar toggle to test light/dark modes.</li>
          </ol>
        </section>

        <nav className="p-3 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center mb-8">
          <Link href="/onboarding" className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg">
            <FaUserPlus />
            <span className="font-medium">Get Started</span>
          </Link>
          <Link href="/wallet" className="px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg">
            <FaWallet />
            <span className="font-medium">Wallet</span>
          </Link>
          <Link href="/verify" className="px-4 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg">
            <FaIdCard />
            <span className="font-medium">Identity Verification</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
