
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

  useEffect(() => {
    const getMovies = async () => {
      const fetchedMovies = await fetchMovies(fetchUrl);
      setMovies(fetchedMovies);
    };
    getMovies();
  }, [fetchUrl]);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  
  if (movies.length === 0) {
    return null; // Don't render the row if there are no movies
  }

  return (
    <div className="h-auto space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
         <button onClick={() => scroll('left')} className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 disabled:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div
          ref={rowRef}
          className="flex items-center space-x-2.5 overflow-x-scroll scrollbar-hide p-2 md:space-x-4"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} isLarge={isLargeRow} />
          ))}
        </div>
        <button onClick={() => scroll('right')} className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 disabled:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Row;
