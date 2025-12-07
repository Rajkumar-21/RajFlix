import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { fetchMovies, tmdbRequests, IMAGE_BASE_URL } from '../services/tmdbService';

interface BannerProps {
  onSelectMovie: (movie: Movie) => void;
  fetchUrl?: string;
}

const Banner: React.FC<BannerProps> = ({ onSelectMovie, fetchUrl }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      const url = fetchUrl || tmdbRequests.fetchTrending;
      if (!url) return;
      const movies = await fetchMovies(url);
      if (movies.length > 0) {
        setMovie(movies[Math.floor(Math.random() * movies.length)]);
      }
    };
    fetchRandomMovie();
  }, [fetchUrl]);

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-[56.25vw] max-h-[800px] bg-gray-900">
        <div className="w-12 h-12 border-4 border-t-brand-red border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-end space-y-2 py-12 md:py-16 px-4 md:space-y-4 min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh]">
      {/* Background Image - Fixed positioning */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden">
        <img
          src={`${IMAGE_BASE_URL}original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          onError={(e) => {
            // Fallback to smaller image if original fails
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('w780')) {
              target.src = `${IMAGE_BASE_URL}w780${movie.backdrop_path || movie.poster_path}`;
            }
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-brand-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/50 to-transparent" />
      </div>

      {/* Content - positioned above background */}
      <div className="relative z-10 space-y-2 md:space-y-4">
        <h1 className="text-3xl font-bold md:text-4xl lg:text-6xl xl:text-7xl drop-shadow-2xl max-w-xl lg:max-w-3xl">
          {movie.title || movie.name || movie.original_name}
        </h1>
        <p className="max-w-xs text-sm md:max-w-lg md:text-base lg:max-w-2xl lg:text-lg drop-shadow-lg leading-relaxed">
          {truncate(movie.overview, 150)}
        </p>

        <div className="flex space-x-2 md:space-x-3 pt-2">
          <button className="flex items-center gap-x-1 md:gap-x-2 rounded px-4 py-1.5 text-xs font-semibold text-black bg-white transition hover:bg-white/75 md:py-2 md:px-6 md:text-base lg:py-2.5 lg:px-8 lg:text-xl" onClick={() => onSelectMovie(movie)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
            Play
          </button>
          <button className="flex items-center gap-x-1 md:gap-x-2 rounded bg-gray-600/70 px-4 py-1.5 text-xs font-semibold transition hover:bg-gray-500/60 md:py-2 md:px-6 md:text-base lg:py-2.5 lg:px-8 lg:text-xl" onClick={() => onSelectMovie(movie)}>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;