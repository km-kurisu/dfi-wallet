"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ThemePositionContext = createContext();

export function useThemePosition() {
  return useContext(ThemePositionContext);
}

export function ThemePositionProvider({ children }) {
  const [position, setPosition] = useState({ x: null, y: null });
  
  useEffect(() => {
    // Function to validate position is within screen bounds
    const validatePosition = (pos) => {
      if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        return false;
      }
      
      // Only run this on client-side
      if (typeof window !== 'undefined') {
        const NAVBAR_HEIGHT = 70;
        const BUTTON_SIZE = 56;
        const EDGE_MARGIN = 16;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Check if position is within valid bounds
        return (
          pos.x >= EDGE_MARGIN && 
          pos.x <= viewportWidth - BUTTON_SIZE - EDGE_MARGIN &&
          pos.y >= NAVBAR_HEIGHT && 
          pos.y <= viewportHeight - BUTTON_SIZE - EDGE_MARGIN
        );
      }
      return true;
    };
    
    // Load saved position or set default position
    try {
      const savedPos = JSON.parse(localStorage.getItem("themeTogglePosition"));
      
      // If saved position exists and is valid, use it
      if (validatePosition(savedPos)) {
        setPosition(savedPos);
      } else {
        // Set default position - bottom right corner
        const defaultX = typeof window !== 'undefined' ? window.innerWidth - 72 : null;
        const defaultY = typeof window !== 'undefined' ? window.innerHeight - 72 : null;
        
        if (defaultX !== null && defaultY !== null) {
          const newDefaultPos = { x: defaultX, y: defaultY };
          setPosition(newDefaultPos);
          localStorage.setItem("themeTogglePosition", JSON.stringify(newDefaultPos));
        }
      }
    } catch (e) {
      console.error("Error loading theme position:", e);
    }
  }, []);
  
  // Handle window resize to keep button in bounds
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (position?.x && position?.y) {
          const BUTTON_SIZE = 56;
          const EDGE_MARGIN = 16;
          const NAVBAR_HEIGHT = 70;
          
          // Get new viewport dimensions
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Check if button would be out of bounds
          const newX = Math.min(Math.max(EDGE_MARGIN, position.x), viewportWidth - BUTTON_SIZE - EDGE_MARGIN);
          const newY = Math.min(Math.max(NAVBAR_HEIGHT, position.y), viewportHeight - BUTTON_SIZE - EDGE_MARGIN);
          
          // Only update if position changed
          if (newX !== position.x || newY !== position.y) {
            const newPos = { x: newX, y: newY };
            setPosition(newPos);
            localStorage.setItem("themeTogglePosition", JSON.stringify(newPos));
          }
        }
      };
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [position]);
  
  const updatePosition = (newPosition) => {
    setPosition(newPosition);
    try {
      localStorage.setItem("themeTogglePosition", JSON.stringify(newPosition));
    } catch (e) {
      console.error("Could not save position", e);
    }
  };
  
  return (
    <ThemePositionContext.Provider value={{ position, updatePosition }}>
      {children}
    </ThemePositionContext.Provider>
  );
}
