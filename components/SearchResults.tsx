import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { searchMulti } from '../services/tmdbService';
import MovieCard from './MovieCard';
import Loader from './Loader';

interface SearchResultsProps {
  query: string;
  onSelectMovie: (movie: Movie) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, onSelectMovie }) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      const searchResults = await searchMulti(query);
      setResults(searchResults);
      setLoading(false);
    };

    // Debounce search to avoid API calls on every keystroke
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (loading) {
    return (
      <div className="pt-24 h-96">
        <Loader />
      </div>
    );
  }

  return (
    <section className="pt-24 pb-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        {results.length > 0 ? `Showing results for "${query}"` : `No results found for "${query}"`}
      </h2>
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(movie => (
            <MovieCard 
              key={`${movie.id}-${movie.media_type}`} 
              movie={movie} 
              onSelectMovie={onSelectMovie} 
              isLarge={true} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;
