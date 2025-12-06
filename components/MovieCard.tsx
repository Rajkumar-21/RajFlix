
import React from 'react';
import type { Movie } from '../types';
import { IMAGE_BASE_URL } from '../services/tmdbService';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  isLarge: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelectMovie, isLarge }) => {
  const imagePath = isLarge ? movie.poster_path : movie.backdrop_path;

  if (!imagePath) {
    return null; // Don't render if there's no image
  }

  const imageUrl = `${IMAGE_BASE_URL}${isLarge ? 'w500' : 'w300'}${imagePath}`;

  return (
    <div
      className={`relative flex-shrink-0 cursor-pointer transform transition-transform duration-200 ease-out 
        ${isLarge ? 'w-48 h-72 md:w-56 md:h-[336px]' : 'w-40 h-24 md:w-64 md:h-36'} 
        hover:scale-105 group`}
      onClick={() => onSelectMovie(movie)}
    >
      <img
        src={imageUrl}
        alt={movie.title || movie.name}
        className="rounded-sm object-cover h-full w-full"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
        <p className="text-white text-center text-xs md:text-sm font-bold">
            {movie.title || movie.name || movie.original_name}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
