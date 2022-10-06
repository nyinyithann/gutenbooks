import { useEffect, useRef } from 'react';

const usePrevious = (value) => {
  const prevVal = useRef(null);

  useEffect(() => {
    prevVal.current = value;
  }, [value]);

  return prevVal.current;
};

export default usePrevious;
