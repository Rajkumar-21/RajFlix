
import React, { useState, useEffect } from 'react';
import type { Movie, Video } from '../types';
import { fetchMovieDetails } from '../services/tmdbService';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [details, setDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      const movieDetails = await fetchMovieDetails(movie.id, movie.first_air_date ? 'tv' : 'movie');
      if (movieDetails) {
        setDetails(movieDetails);
        const trailer = movieDetails.videos?.results.find(
          (video: Video) => video.type === 'Trailer' || video.type === 'Teaser'
        );
        setTrailerKey(trailer?.key || null);
      }
      setLoading(false);
    };
    getDetails();
  }, [movie]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-brand-black w-full max-w-4xl rounded-lg overflow-hidden mx-4 my-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="relative pt-[56.25%]">
          {loading ? (
             <div className="absolute inset-0 bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-t-brand-red border-gray-600 rounded-full animate-spin"></div></div>
          ) : trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          ) : (
             <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`} alt={movie.title} className="absolute top-0 left-0 w-full h-full object-cover" />
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
