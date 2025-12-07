import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';
import { searchMulti } from '../services/tmdbService';
import MovieCard from './MovieCard';
import Loader from './Loader';

interface SearchResultsProps {
  query: string;
  onSelectMovie: (movie: Movie) => void;
}

type MediaTypeFilter = 'all' | 'movie' | 'tv';
type YearFilter = 'all' | '2024' | '2023' | '2022' | '2021' | '2020' | '2010s' | '2000s' | '1990s';
type RatingFilter = 'all' | '9+' | '8+' | '7+' | '6+';

const SearchResults: React.FC<SearchResultsProps> = ({ query, onSelectMovie }) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [filteredResults, setFilteredResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState<MediaTypeFilter>('all');
  const [yearFilter, setYearFilter] = useState<YearFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');

  useEffect(() => {
    if (!query) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      const searchResults = await searchMulti(query);
      setResults(searchResults);
      setFilteredResults(searchResults);
      setLoading(false);
    };

    // Debounce search to avoid API calls on every keystroke
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Apply filters whenever results or filter values change
  useEffect(() => {
    let filtered = [...results];

    // Media Type Filter
    if (mediaType !== 'all') {
      filtered = filtered.filter(item => item.media_type === mediaType);
    }

    // Year Filter
    if (yearFilter !== 'all') {
      const yearRange = getYearRange(yearFilter);
      if (yearRange) {
        filtered = filtered.filter(item => {
          const releaseDate = item.release_date || item.first_air_date;
          if (!releaseDate) return false;
          const year = new Date(releaseDate).getFullYear();
          return year >= yearRange.min && year <= yearRange.max;
        });
      }
    }

    // Rating Filter
    if (ratingFilter !== 'all') {
      const minRating = getRatingValue(ratingFilter);
      if (minRating !== null) {
        filtered = filtered.filter(item => {
          const rating = item.vote_average || 0;
          return rating >= minRating;
        });
      }
    }

    setFilteredResults(filtered);
  }, [results, mediaType, yearFilter, ratingFilter]);

  const getYearRange = (filter: YearFilter): { min: number; max: number } | null => {
    switch (filter) {
      case '2024': return { min: 2024, max: 2024 };
      case '2023': return { min: 2023, max: 2023 };
      case '2022': return { min: 2022, max: 2022 };
      case '2021': return { min: 2021, max: 2021 };
      case '2020': return { min: 2020, max: 2020 };
      case '2010s': return { min: 2010, max: 2019 };
      case '2000s': return { min: 2000, max: 2009 };
      case '1990s': return { min: 1990, max: 1999 };
      default: return null;
    }
  };

  const getRatingValue = (filter: RatingFilter): number | null => {
    switch (filter) {
      case '9+': return 9;
      case '8+': return 8;
      case '7+': return 7;
      case '6+': return 6;
      default: return null;
    }
  };

  const handleResetFilters = () => {
    setMediaType('all');
    setYearFilter('all');
    setRatingFilter('all');
  };

  if (loading) {
    return (
      <div className="pt-24 h-96">
        <Loader />
      </div>
    );
  }

  const hasActiveFilters = mediaType !== 'all' || yearFilter !== 'all' || ratingFilter !== 'all';

  // Get search hints based on results
  const getSearchHint = () => {
    if (results.length === 0 && query.length > 0) {
      return (
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-4">
          <p className="text-yellow-200 text-sm">
            💡 <strong>Search Tip:</strong> Try different keywords or check for spelling. Our search looks for matches anywhere in the title.
            <br />
            <span className="text-yellow-300/70">Example: Searching "monkey" will find "The Monkey", "Monkey Man", etc.</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="pt-24 pb-8">
      {/* Header with Filters */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          {results.length > 0 ? `Search results for "${query}"` : `No results found for "${query}"`}
        </h2>

        {getSearchHint()}

        {results.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Showing {filteredResults.length} of {results.length} results</span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="ml-2 text-brand-red hover:text-red-400 underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Media Type Filter */}
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as MediaTypeFilter)}
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-brand-red cursor-pointer text-sm"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>

              {/* Year Filter */}
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value as YearFilter)}
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-brand-red cursor-pointer text-sm"
              >
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2010s">2010-2019</option>
                <option value="2000s">2000-2009</option>
                <option value="1990s">1990-1999</option>
              </select>

              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
                className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-brand-red cursor-pointer text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="9+">9+ Stars</option>
                <option value="8+">8+ Stars</option>
                <option value="7+">7+ Stars</option>
                <option value="6+">6+ Stars</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {filteredResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredResults.map(movie => (
            <MovieCard 
              key={`${movie.id}-${movie.media_type}`} 
              movie={movie} 
              onSelectMovie={onSelectMovie} 
              isLarge={true} 
            />
          ))}
        </div>
      )}

      {/* No Results After Filtering */}
      {results.length > 0 && filteredResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No results match your filter criteria.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-6 py-2 bg-brand-red text-white rounded hover:bg-red-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default SearchResults;
