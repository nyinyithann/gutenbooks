/* eslint-disable no-empty */
import { useEffect, useState } from 'react';

const THEME_KEY = 'gutenbooks_theme';
const DEFAULT_THEME = 'theme-blue';

const useTheme = (defaultTheme) => {
  const [storedTheme, setStoredTheme] = useState(defaultTheme);

  useEffect(() => {
    try {
      const theme = localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME;
      setStoredTheme(theme);
    } catch {}
  }, []);

  const setTheme = (value) => {
    try {
      localStorage.setItem(THEME_KEY, value);
      setStoredTheme(value);
    } catch {}
  };

  return [storedTheme, setTheme];
};

export default useTheme;
