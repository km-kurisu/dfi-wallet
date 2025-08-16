"use client";

import ThemeExample from '../../components/ThemeExample';
import { useEffect } from 'react';

export default function ThemeShowcasePage() {
  useEffect(() => {
    // Set document title
    document.title = "Theme Showcase - DFI Wallet";
  }, []);

  return (
    <main className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Next.js Theme System Showcase</h1>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          This page demonstrates the primary-secondary color theme system used throughout the application.
          The theme adapts to both light and dark modes while maintaining the Next.js color scheme.
        </p>
        
        <ThemeExample />
      </div>
    </main>
  );
}
