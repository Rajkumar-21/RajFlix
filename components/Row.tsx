import React, { useState, useEffect, useRef } from 'react';
import type { Movie } from '../types';
import { fetchMovies } from '../services/tmdbService';
import MovieCard from './MovieCard';

interface RowProps {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
  onSelectMovie: (movie: Movie) => void;
}

const Row: React.FC<RowProps> = ({ title, fetchUrl, isLargeRow = false, onSelectMovie }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      const fetchedMovies = await fetchMovies(fetchUrl);
      setMovies(fetchedMovies);
      // Timeout to allow the DOM to update before checking scroll
      setTimeout(checkScroll, 100);
    };
    getMovies();
  }, [fetchUrl]);
  
  const checkScroll = () => {
    if (rowRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setIsMoved(scrollLeft > 0);
        // Add a small buffer to account for subpixel rendering
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    const scroller = rowRef.current;
    if (scroller) {
        scroller.addEventListener('scroll', checkScroll);
        // Initial check
        checkScroll();
    }
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);

    return () => {
        if (scroller) {
            scroller.removeEventListener('scroll', checkScroll);
        }
        window.removeEventListener('resize', handleResize);
    };
  }, [movies]);


  if (movies.length === 0) {
    return null; // Don't render the row if there are no movies
  }

  return (
    <div className="h-auto space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
         {isMoved && (
            <button onClick={() => scroll('left')} className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-80 transition hover:scale-125 hover:opacity-100 hidden md:flex items-center justify-center bg-black/40 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
         )}
        <div
          ref={rowRef}
          className="flex items-center space-x-2.5 overflow-x-scroll scrollbar-hide p-2 md:space-x-4"
          onScroll={checkScroll}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} isLarge={isLargeRow} />
          ))}
        </div>
        {!isAtEnd && (
            <button onClick={() => scroll('right')} className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-80 transition hover:scale-125 hover:opacity-100 hidden md:flex items-center justify-center bg-black/40 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        )}
      </div>
    </div>
  );
};

export default Row;