"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const ThemePositionContext = createContext();

export function useThemePosition() {
  return useContext(ThemePositionContext);
}

export function ThemePositionProvider({ children }) {
  const [position, setPosition] = useState({ x: null, y: null });
  
  useEffect(() => {
    // Load saved position
    try {
      const savedPos = JSON.parse(localStorage.getItem("themeTogglePosition"));
      if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
        setPosition(savedPos);
      }
    } catch (e) {
      // Use default position if there's an error
    }
  }, []);
  
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
