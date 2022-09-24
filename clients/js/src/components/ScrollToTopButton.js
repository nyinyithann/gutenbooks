import { ChevronUpIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';

function ScrollToTopButton({ className }) {
  const [isVisible, setVisibility] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setVisibility(true);
    } else {
      setVisibility(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  className = isVisible ? `${className} opacity-100` : `${className} opacity-0`;

  return (
    <button type="button" className={className} onClick={scrollToTop}>
      <ChevronUpIcon />
    </button>
  );
}

export default ScrollToTopButton;
