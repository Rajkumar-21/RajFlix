import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { fetchMovies, getTmdbRequests, IMAGE_BASE_URL } from '../services/tmdbService';

interface BannerProps {
  onSelectMovie: (movie: Movie) => void;
}

const Banner: React.FC<BannerProps> = ({ onSelectMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      const tmdbRequests = getTmdbRequests();
      if (!tmdbRequests.fetchTrending) return;
      const movies = await fetchMovies(tmdbRequests.fetchTrending);
      if (movies.length > 0) {
        setMovie(movies[Math.floor(Math.random() * movies.length)]);
      }
    };
    fetchRandomMovie();
  }, []);

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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
