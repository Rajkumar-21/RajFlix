
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 z-50 flex w-full items-center justify-between p-4 transition-all lg:px-16 lg:py-6 ${isScrolled ? 'bg-brand-black/90' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <h1 className="text-2xl md:text-4xl font-bold text-brand-red cursor-pointer tracking-wider">
            CINEFLUX
        </h1>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light">
         <img
          src="https://picsum.photos/50"
          alt="Profile"
          className="cursor-pointer rounded"
        />
      </div>
    </header>
  );
};

export default Header;
