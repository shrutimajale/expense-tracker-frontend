import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored) {
      setDarkMode(stored === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
