import { useEffect, useRef, useState } from 'react';

const useDebounce = (delay, initialValue) => {
  const id = useRef(null);
  const [value, setValue] = useState(initialValue);
  const valRef = useRef();

  const setDebounce = (val) => {
    valRef.current = val;
  };

  useEffect(() => {
    clearTimeout(id.current);
    id.current = setTimeout(() => {
      setValue(valRef.current);
    }, delay);
    return () => {
      clearTimeout(id.current);
    };
  }, [delay, valRef.current]);

  return [value, setDebounce];
};

export default useDebounce;
