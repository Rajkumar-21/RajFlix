import React, { useState, useEffect, useRef } from 'react';
import type { View } from '../App';
import profileImage from '../assets/Raj_profile_pic.jpg';
import { genres } from '../services/tmdbService';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
    onSearch: (query: string) => void;
    onGenreSelect: (genreId: number) => void;
    selectedGenreId: number | null;
    onOpenAbout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onSearch, onGenreSelect, selectedGenreId, onOpenAbout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const genreMenuRef = useRef<HTMLDivElement>(null);

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

  // Close profile and genre menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (genreMenuRef.current && !genreMenuRef.current.contains(event.target as Node)) {
        setIsGenreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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
        className={`cursor-pointer text-sm font-light transition-colors duration-200 hover:text-gray-300 ${!searchQuery && currentView === view && view !== 'genre' ? 'text-white font-semibold' : 'text-gray-400'}`}
    >
        {title}
    </button>
  );

  const handleGenreClick = (genreId: number) => {
    onGenreSelect(genreId);
    setIsGenreMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3 transition-all md:px-8 lg:px-16 lg:py-6 ${isScrolled || isSearchOpen ? 'bg-brand-black/95 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <h1 className="font-display text-2xl md:text-4xl lg:text-5xl text-brand-red cursor-pointer whitespace-nowrap" onClick={() => onNavigate('home')}>
            RajFlix
        </h1>
        <nav className="hidden space-x-4 md:flex items-center">
            <NavLink view="home" title="Home" />
            <NavLink view="tv" title="TV Shows" />
            <NavLink view="movies" title="Movies" />
            <div className="relative" ref={genreMenuRef}>
              <button
                onClick={() => setIsGenreMenuOpen(!isGenreMenuOpen)}
                className={`cursor-pointer text-sm font-light transition-colors duration-200 hover:text-gray-300 flex items-center space-x-1 ${!searchQuery && currentView === 'genre' ? 'text-white font-semibold' : 'text-gray-400'}`}
              >
                <span>Genres</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {isGenreMenuOpen && (
                <div className="absolute top-8 left-0 w-56 bg-black/95 border border-gray-700 rounded-md shadow-lg py-2 max-h-96 overflow-y-auto z-50 scrollbar-hide">
                  <div className="grid grid-cols-1 gap-1">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreClick(genre.id)}
                        className={`text-left px-4 py-2 text-sm transition-colors ${
                          selectedGenreId === genre.id
                            ? 'bg-brand-red text-white'
                            : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </nav>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4 text-sm font-light">
         <div className="flex items-center space-x-2">
            <form onSubmit={handleSearchSubmit} className={`transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-40 sm:w-48 md:w-64' : 'w-0'}`}>
               <input
                 ref={searchInputRef}
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search..."
                 className={`bg-transparent border-b-2 ${isSearchOpen ? 'p-1 opacity-100' : 'p-0 opacity-0'} w-full focus:outline-none focus:border-brand-red text-white transition-opacity duration-300 text-sm`}
               />
            </form>
            <button onClick={() => isSearchOpen ? handleClearSearch() : setIsSearchOpen(true)} className="text-white hover:text-gray-300">
              {isSearchOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                 </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
            </button>
         </div>
         <div className="relative" ref={profileMenuRef}>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="focus:outline-none">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="h-7 w-7 md:h-8 md:w-8 cursor-pointer rounded object-cover transition-transform duration-200 hover:scale-110 hover:ring-2 hover:ring-brand-red"
                />
            </button>
            {isProfileMenuOpen && (
                <div className="absolute top-12 right-0 w-48 bg-black/90 border border-gray-700 rounded-md shadow-lg py-2 animate-fade-in">
                    <div className="flex items-center space-x-3 px-4 py-2 border-b border-gray-700">
                        <img src={profileImage} alt="Profile" className="h-10 w-10 rounded object-cover" />
                        <span className="font-semibold text-white">Rajkumar</span>
                    </div>
                    <button 
                        onClick={() => {
                            onOpenAbout();
                            setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50"
                    >
                        About
                    </button>
                </div>
            )}
         </div>
      </div>
    </header>
  );
};

export default Header;