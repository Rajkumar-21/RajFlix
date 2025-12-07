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

  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'hi': 'Hindi',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ar': 'Arabic',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ml': 'Malayalam',
    };
    return languages[code] || code.toUpperCase();
  };

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
        <div className="p-8 space-y-4 max-h-[50vh] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <p className="text-green-400 font-semibold">⭐ {movie.vote_average?.toFixed(1) || 'N/A'} / 10</p>
            <p className="text-gray-300">{movie.release_date || movie.first_air_date}</p>
            {details?.runtime && (
              <p className="text-gray-300">{details.runtime} min</p>
            )}
            {details?.number_of_seasons && (
              <p className="text-gray-300">{details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</p>
            )}
            {details?.original_language && (
              <p className="text-gray-300 flex items-center gap-1">
                <span>🌐</span>
                <span>{getLanguageName(details.original_language)}</span>
              </p>
            )}
          </div>
          <p className="text-base md:text-lg leading-relaxed">{movie.overview}</p>
          {details?.genres && details.genres.length > 0 && (
            <div>
              <span className="text-gray-400">Genres: </span>
              <span className="text-white">{details.genres.map(genre => genre.name).join(', ')}</span>
            </div>
          )}
          {details?.production_companies && details.production_companies.length > 0 && (
            <div>
              <span className="text-gray-400">Production: </span>
              <span className="text-white">{details.production_companies.slice(0, 3).map(company => company.name).join(', ')}</span>
            </div>
          )}
          {details?.spoken_languages && details.spoken_languages.length > 0 && (
            <div>
              <span className="text-gray-400">Available Languages: </span>
              <span className="text-white">{details.spoken_languages.map((lang: any) => lang.english_name || lang.name).join(', ')}</span>
            </div>
          )}
          {details?.status && (
            <div>
              <span className="text-gray-400">Status: </span>
              <span className="text-white">{details.status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;