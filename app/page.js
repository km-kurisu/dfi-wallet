"use client";
import { useEffect } from "react";
import Link from "next/link";
import { FaUserPlus, FaWallet, FaIdCard, FaReact, FaCss3Alt, FaEthereum, FaMobile, FaHome, FaChartPie, FaUser } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiFramer } from 'react-icons/si';
import HomeRedirect from "./HomeRedirect";
import { useAuth } from "../contexts/AuthContext";
import { AnimatedSection } from "../components/AnimatedSection";
import { motion } from "framer-motion";

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


        <AnimatedSection delay={0.1}>
          <header className="my-8 sm:my-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">Welcome to DFI Wallet</h1>
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">A simple, secure, and user-friendly platform for digital financial inclusion. Follow the steps below to get started and explore all features.</p>
          </header>
        </AnimatedSection>

        <section className="mb-8 sm:mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={0.2}>
            {/* Step 1: Create Account */}
            <div className="flex flex-col items-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-2xl p-6 shadow-xl">
              <FaUserPlus className="text-4xl text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">1. Create Your Account</h3>
              <p className="text-slate-700 dark:text-slate-300 text-center mb-2">Go to <b>Get Started</b> or <b>Onboarding</b> and fill in your name, email, and password, or use Google sign-in. After registering, you’ll be redirected to your wallet.</p>
              <Link href="/onboarding" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-md">
                <FaUserPlus /> <span>Get Started</span>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            {/* Step 2: Verify Identity */}
            <div className="flex flex-col items-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-2xl p-6 shadow-xl">
              <FaIdCard className="text-4xl text-fuchsia-600 dark:text-fuchsia-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">2. Verify Your Identity</h3>
              <p className="text-slate-700 dark:text-slate-300 text-center mb-2">Go to <b>ID Verify</b> and follow the prompts to upload a document and a short video. The system will process your submission and update your verification status.</p>
              <Link href="/verify" className="mt-2 px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 flex items-center gap-2 transition-colors shadow-md">
                <FaIdCard /> <span>ID Verify</span>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            {/* Step 3: Connect Wallet */}
            <div className="flex flex-col items-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-2xl p-6 shadow-xl">
              <FaWallet className="text-4xl text-violet-600 dark:text-violet-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">3. Connect Your Wallet</h3>
              <p className="text-slate-700 dark:text-slate-300 text-center mb-2">Go to the <b>Wallet</b> page and click <b>Connect MetaMask</b>. Follow the prompts to link your Ethereum wallet. You can view your balance, send transactions, and see your transaction history.</p>
              <Link href="/wallet" className="mt-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2 transition-colors shadow-md">
                <FaWallet /> <span>Wallet</span>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            {/* Step 4: Market Analysis */}
            <div className="flex flex-col items-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-2xl p-6 shadow-xl">
              <FaChartPie className="text-4xl text-indigo-500 dark:text-indigo-300 mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">4. Market Analysis</h3>
              <p className="text-slate-700 dark:text-slate-300 text-center mb-2">Visit <b>Market Analysis</b> to view live Ethereum price trends and AI-powered insights. Stay informed about the crypto market directly from your dashboard.</p>
              <Link href="/market-analysis" className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-2 transition-colors shadow-md">
                <FaChartPie /> <span>Market Analysis</span>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            {/* Step 5: Profile & Navigation */}
            <div className="flex flex-col items-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 rounded-2xl p-6 shadow-xl md:col-span-2">
              <FaUser className="text-4xl text-slate-700 dark:text-slate-200 mb-3" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">5. Profile & Navigation</h3>
              <p className="text-slate-700 dark:text-slate-300 text-center mb-2">Use the navigation bar at the top to access all pages. Visit your <b>Profile</b> to view or edit your account details and see your verification status. Use the floating theme toggle to switch between light and dark modes anytime.</p>
              <Link href="/profile" className="mt-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2 transition-colors shadow-md">
                <FaUser /> <span>Profile</span>
              </Link>
            </div>
          </AnimatedSection>
        </section>

  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="p-4 sm:p-6 rounded-2xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-2xl transition-transform hover:scale-[1.01]">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Project overview</h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">This project demonstrates a practitioner-ready front-end that combines mobile-friendly UX, wallet connectivity (MetaMask), and a mock identity verification flow. The goal is to make basic financial services accessible to people without traditional banking.</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white/20 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-slate-800/30 shadow-2xl transition-transform hover:scale-[1.01]">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Key features</h2>
            <motion.ul
              className="list-disc pl-5 text-sm sm:text-base text-slate-700 dark:text-slate-300 space-y-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px 0px' }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.13 } }
              }}
            >
              {["Onboarding form with minimal fields and progressive verification.",
                "Blockchain wallet connect (MetaMask) for secure payments/identity anchors.",
                "Digital identity verification mock (file upload + status) to illustrate flow.",
                "Dark/light theme with accessible colors and glass UI elements."]
              .map((text, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -24 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.08 } }
                  }}
                >
                  {text}
                </motion.li>
              ))}
            </motion.ul>
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
          <motion.ol
            className="list-decimal pl-5 sm:pl-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 space-y-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px 0px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13 } }
            }}
          >
            {[
              <>Open <strong>Get Started</strong> to simulate onboarding and identity verification.</>,
              <>Use <strong>Wallet</strong> to connect MetaMask (or a browser wallet) to test account flows.</>,
              <>Toggle theme using the floating button or navbar toggle to test light/dark modes.</>
            ].map((el, i) => (
              <motion.li
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.08 } }
                }}
              >
                {el}
              </motion.li>
            ))}
          </motion.ol>
        </section>

        
      </div>
    </main>
  );
}
