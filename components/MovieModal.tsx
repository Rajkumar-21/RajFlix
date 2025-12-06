import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { fetchMovieDetails, IMAGE_BASE_URL } from '../services/tmdbService';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [details, setDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      const movieDetails = await fetchMovieDetails(movie.id, movie.first_air_date ? 'tv' : 'movie');
      if (movieDetails) {
        setDetails(movieDetails);
      }
      setLoading(false);
    };
    getDetails();
  }, [movie]);

  const backgroundImageUrl = movie.backdrop_path || movie.poster_path 
    ? `url(${IMAGE_BASE_URL}original${movie.backdrop_path || movie.poster_path})`
    : 'none';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-brand-black w-full max-w-4xl rounded-lg overflow-hidden mx-4 my-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div 
          className="relative pt-[56.25%] bg-cover bg-center" 
          style={{ 
            backgroundImage: backgroundImageUrl,
            backgroundColor: backgroundImageUrl === 'none' ? '#141414' : 'transparent',
          }}
        >
          {loading && (
             <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><div className="w-12 h-12 border-4 border-t-brand-red border-gray-600 rounded-full animate-spin"></div></div>
          )}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-brand-black p-8">
             <h2 className="text-2xl md:text-4xl font-bold">{movie.title || movie.name}</h2>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <p className="text-green-400 font-semibold">Rating: {movie.vote_average.toFixed(1)} / 10</p>
            <p>{movie.release_date || movie.first_air_date}</p>
          </div>
          <p className="text-base md:text-lg">{movie.overview}</p>
          <div>
            <span className="text-gray-400">Genres: </span>
            {details?.genres?.map(genre => genre.name).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;