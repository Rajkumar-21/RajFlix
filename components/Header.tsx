import React, { useState, useEffect, useRef } from 'react';
import type { View } from '../App';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setIsSearchOpen(false);
  };

  const NavLink: React.FC<{ view: View, title: string }> = ({ view, title }) => (
    <button 
        onClick={() => onNavigate(view)}
        className={`cursor-pointer text-sm font-light transition-colors duration-200 hover:text-gray-300 ${!searchQuery && currentView === view ? 'text-white font-semibold' : 'text-gray-400'}`}
    >
        {title}
    </button>
  );

  return (
    <header className={`fixed top-0 z-50 flex w-full items-center justify-between p-4 transition-all lg:px-16 lg:py-6 ${isScrolled || isSearchOpen ? 'bg-brand-black/90 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <h1 className="text-2xl md:text-4xl font-bold text-brand-red cursor-pointer tracking-wider" onClick={() => onNavigate('home')}>
            CINEFLUX
        </h1>
        <nav className="hidden space-x-4 md:flex">
            <NavLink view="home" title="Home" />
            <NavLink view="tv" title="TV Shows" />
            <NavLink view="movies" title="Movies" />
        </nav>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light">
         <div className="flex items-center space-x-2">
            <form onSubmit={handleSearchSubmit} className={`transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-48 md:w-64' : 'w-0'}`}>
               <input
                 ref={searchInputRef}
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search titles..."
                 className={`bg-transparent border-b-2 ${isSearchOpen ? 'p-1 opacity-100' : 'p-0 opacity-0'} w-full focus:outline-none focus:border-brand-red text-white transition-opacity duration-300`}
               />
            </form>
            <button onClick={() => isSearchOpen ? handleClearSearch() : setIsSearchOpen(true)} className="text-white hover:text-gray-300">
              {isSearchOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                 </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
            </button>
         </div>
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