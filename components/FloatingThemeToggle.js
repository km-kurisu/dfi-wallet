"use client";
import { useState, useEffect } from "react";
import { useThemePosition } from "../contexts/ThemePositionContext";

export default function FloatingThemeToggle({ defaultPosition = { top: 'auto', right: '20px', bottom: '20px', left: 'auto' } }) {
  // undefined = not yet initialized, true = dark, false = light
  const [isDark, setIsDark] = useState(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const { position, updatePosition } = useThemePosition();

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  // Handle drag start
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // Get available screen dimensions
        const maxWidth = window.innerWidth - 60; // 60 = button width
        const maxHeight = window.innerHeight - 60; // 60 = button height
        
        // Calculate new position, keeping button within viewport
        const newX = Math.min(Math.max(0, e.clientX - 30), maxWidth);
        const newY = Math.min(Math.max(0, e.clientY - 30), maxHeight);
        
        updatePosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, position]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  // Default position (bottom right) if not set
  const buttonStyle = {
    position: 'fixed',
    zIndex: 100,
    cursor: isDragging ? 'grabbing' : 'grab',
    right: position?.x !== undefined ? 'auto' : defaultPosition.right,
    bottom: position?.y !== undefined ? 'auto' : defaultPosition.bottom,
    left: position?.x !== undefined ? `${position.x}px` : defaultPosition.left,
    top: position?.y !== undefined ? `${position.y}px` : defaultPosition.top,
    touchAction: 'none'
  };

  // Don't render until we've determined the theme to prevent flash
  if (isDark === undefined) {
    return null;
  }

  return (
    <button
      style={buttonStyle}
      className={`
        flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full
        bg-white/80 dark:bg-slate-800/80 shadow-lg backdrop-blur-md
        border border-white/20 dark:border-slate-700/20
        text-slate-700 dark:text-slate-200 
        transition-all duration-300 hover:scale-110
        ${isDragging ? 'scale-90' : ''}
      `}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
