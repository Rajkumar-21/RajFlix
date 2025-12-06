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
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12">
      <div className="absolute top-0 left-0 -z-10 h-[95vh] w-screen">
        <img
          src={`${IMAGE_BASE_URL}original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title || movie.name}
          className="h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 to-brand-black" />
      </div>

      <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl">
        {movie.title || movie.name || movie.original_name}
      </h1>
      <p className="max-w-xs text-xs text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
        {truncate(movie.overview, 150)}
      </p>

      <div className="flex space-x-3">
        <button className="flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold text-black bg-white transition hover:bg-white/75 md:py-2.5 md:px-8 md:text-xl" onClick={() => onSelectMovie(movie)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
          Play
        </button>
        <button className="flex items-center gap-x-2 rounded bg-gray-600/70 px-5 py-1.5 text-sm font-semibold transition hover:bg-gray-500/60 md:py-2.5 md:px-8 md:text-xl" onClick={() => onSelectMovie(movie)}>
          More Info
        </button>
      </div>
    </div>
  );
};

export default Banner;