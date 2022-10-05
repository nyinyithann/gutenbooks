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

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0 });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const cn = isVisible
    ? `${className} opacity-100 hover:cursor-pointer`
    : `${className} opacity-0 hover:cursor-pointer`;

  return (
    <button
      type="button"
      className={cn}
      onClick={scrollToTop}
      onTouchStart={scrollToTop}
    >
      <ChevronUpIcon className="hover:cursor-pointer" />
    </button>
  );
}

export default ScrollToTopButton;
