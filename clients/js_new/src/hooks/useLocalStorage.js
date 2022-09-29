/* eslint-disable no-empty */
import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const v = typeof value === 'function' ? value(storedValue) : value;
      localStorage.setItem(key, JSON.stringify(v));
      setStoredValue(v);
    } catch {}
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
