import React, { useState, useEffect } from 'react';
import Row from './Row';
import Banner from './Banner';
import { getGenreUrl, genres } from '../services/tmdbService';
import type { Movie } from '../types';

interface GenreViewProps {
  genreId: number;
  onSelectMovie: (movie: Movie) => void;
}

type MediaTypeFilter = 'all' | 'movie' | 'tv';
type YearFilter = 'all' | '2024' | '2023' | '2022' | '2021' | '2020' | '2010s' | '2000s' | '1990s';
type RatingFilter = 'all' | '9+' | '8+' | '7+' | '6+';

const GenreView: React.FC<GenreViewProps> = ({ genreId, onSelectMovie }) => {
  const [mediaType, setMediaType] = useState<MediaTypeFilter>('all');
  const [yearFilter, setYearFilter] = useState<YearFilter>('all');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [movieUrl, setMovieUrl] = useState('');
  const [tvUrl, setTvUrl] = useState('');

  const selectedGenre = genres.find(g => g.id === genreId);

  const getYearRange = (filter: YearFilter): { min: string; max: string } | null => {
    const currentYear = new Date().getFullYear();
    switch (filter) {
      case '2024': return { min: '2024-01-01', max: '2024-12-31' };
      case '2023': return { min: '2023-01-01', max: '2023-12-31' };
      case '2022': return { min: '2022-01-01', max: '2022-12-31' };
      case '2021': return { min: '2021-01-01', max: '2021-12-31' };
      case '2020': return { min: '2020-01-01', max: '2020-12-31' };
      case '2010s': return { min: '2010-01-01', max: '2019-12-31' };
      case '2000s': return { min: '2000-01-01', max: '2009-12-31' };
      case '1990s': return { min: '1990-01-01', max: '1999-12-31' };
      default: return null;
    }
  };

  const getRatingValue = (filter: RatingFilter): string | null => {
    switch (filter) {
      case '9+': return '9';
      case '8+': return '8';
      case '7+': return '7';
      case '6+': return '6';
      default: return null;
    }
  };

  useEffect(() => {
    const buildUrl = (type: 'movie' | 'tv') => {
      let url = getGenreUrl(genreId, type);
      
      const yearRange = getYearRange(yearFilter);
      if (yearRange) {
        const dateParam = type === 'movie' ? 'primary_release_date' : 'first_air_date';
        url += `&${dateParam}.gte=${yearRange.min}&${dateParam}.lte=${yearRange.max}`;
      }
      
      const rating = getRatingValue(ratingFilter);
      if (rating) {
        url += `&vote_average.gte=${rating}&vote_count.gte=100`;
      }
      
      return url;
    };

    setMovieUrl(buildUrl('movie'));
    setTvUrl(buildUrl('tv'));
  }, [genreId, yearFilter, ratingFilter]);

  return (
    <div className="genre-view">
      {/* Banner */}
      <Banner onSelectMovie={onSelectMovie} fetchUrl={movieUrl} />

      {/* Filters Section */}
      <div className="px-4 lg:px-16 py-4 md:py-6">
        <div className="flex flex-col gap-3 md:gap-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
            {selectedGenre?.name || 'Genre'} Collection
          </h2>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
            {/* Media Type Filter */}
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaTypeFilter)}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-brand-red cursor-pointer text-sm flex-1 sm:flex-none"
              aria-label="Filter by media type"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value as YearFilter)}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-brand-red cursor-pointer text-sm flex-1 sm:flex-none"
              aria-label="Filter by year"
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
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-brand-red cursor-pointer text-sm flex-1 sm:flex-none"
              aria-label="Filter by rating"
            >
              <option value="all">All Ratings</option>
              <option value="9+">9+ Stars</option>
              <option value="8+">8+ Stars</option>
              <option value="7+">7+ Stars</option>
              <option value="6+">6+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <section className="md:space-y-16">
        {(mediaType === 'all' || mediaType === 'movie') && (
          <Row
            title={`${selectedGenre?.name || 'Genre'} Movies`}
            fetchUrl={movieUrl}
            onSelectMovie={onSelectMovie}
            isLargeRow
          />
        )}
        {(mediaType === 'all' || mediaType === 'tv') && (
          <Row
            title={`${selectedGenre?.name || 'Genre'} TV Shows`}
            fetchUrl={tvUrl}
            onSelectMovie={onSelectMovie}
          />
        )}
      </section>
    </div>
  );
};

export default GenreView;
