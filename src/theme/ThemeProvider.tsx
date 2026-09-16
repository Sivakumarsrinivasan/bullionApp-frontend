import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  lightColors,
  darkColors,
  AppColors,
} from './colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  colors: AppColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode(current =>
      current === 'light' ? 'dark' : 'light',
    );
  };

  const colors = useMemo(
    () => (mode === 'light' ? lightColors : darkColors),
    [mode],
  );

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider',
    );
  }

  return context;
};