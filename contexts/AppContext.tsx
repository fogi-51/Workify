
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AppContextType, Theme } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light;
    }
    return Theme.Light;
  });
  
  const [activeToolId, setActiveToolId] = useState<string>('dashboard');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === Theme.Light ? Theme.Dark : Theme.Light);
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  };
  
  const value = {
    theme,
    toggleTheme,
    activeToolId,
    setActiveToolId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};