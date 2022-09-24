import { useEffect, useRef, useState } from 'react';

const useDebounce = (delay, initialValue) => {
  let id = null;
  const [value, setValue] = useState(initialValue);
  const valRef = useRef();
  const setDebounce = (val) => (valRef.current = val);

  useEffect(() => {
    clearTimeout(id);
    id = setTimeout(() => setValue(valRef.current), delay);
    return () => {
      clearTimeout(id);
    };
  }, [delay, valRef.current]);

  return [value, setDebounce];
};

export default useDebounce;
