
import React, { useState, useCallback } from 'react';
import { getMovieSuggestions } from '../services/geminiService';
import { searchMovie } from '../services/tmdbService';
import type { Movie } from '../types';
import MovieCard from './MovieCard';
import Loader from './Loader';

interface AiSuggesterProps {
  onSelectMovie: (movie: Movie) => void;
}

const AiSuggester: React.FC<AiSuggesterProps> = ({ onSelectMovie }) => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestion = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const titles = await getMovieSuggestions(prompt);
    if (titles.length === 0) {
      setError('Could not find suggestions. Try a different description.');
      setIsLoading(false);
      return;
    }

    const moviePromises = titles.map(title => searchMovie(title));
    const movieResults = await Promise.all(moviePromises);
    
    const foundMovies = movieResults.filter((movie): movie is Movie => movie !== null);

    if(foundMovies.length === 0) {
      setError('Found suggestions but could not match them to movies in the database.');
    } else {
      setSuggestions(foundMovies);
    }

    setIsLoading(false);
  }, [prompt]);

  return (
    <div className="p-4 md:p-0">
      <div className="max-w-4xl mx-auto bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">AI Movie Suggester</h2>
        <p className="text-gray-300 mb-6">Can't decide what to watch? Describe a movie or a mood, and let our AI find suggestions for you!</p>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a funny sci-fi movie about aliens on vacation"
            className="flex-grow p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
            onKeyDown={(e) => e.key === 'Enter' && handleSuggestion()}
          />
          <button
            onClick={handleSuggestion}
            disabled={isLoading}
            className="px-6 py-3 bg-brand-red text-white font-bold rounded-md transition-colors hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Thinking...' : 'Get Suggestions'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        
        {isLoading && (
            <div className="mt-8 h-40">
                <Loader />
            </div>
        )}

        {suggestions.length > 0 && !isLoading && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Here's what I found:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {suggestions.map(movie => (
                <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} isLarge={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSuggester;