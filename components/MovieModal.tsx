import React, { useState, useEffect, useRef } from 'react';
import type { Movie, Cast } from '../types';
import { fetchMovieDetails, fetchCast, fetchWatchProviders, IMAGE_BASE_URL } from '../services/tmdbService';
import CastModal from './CastModal';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, onSelectMovie }) => {
  const [details, setDetails] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [watchProviders, setWatchProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCastId, setSelectedCastId] = useState<number | null>(null);
  const castScrollRef = useRef<HTMLDivElement>(null);
  const [castScrollLeft, setCastScrollLeft] = useState(false);
  const [castScrollRight, setCastScrollRight] = useState(false);

  const handleNewMovieSelect = (newMovie: Movie) => {
    setSelectedCastId(null); // Close cast modal
    onClose(); // Close current movie modal
    // Small delay to ensure modals close before opening new one
    setTimeout(() => {
      onSelectMovie(newMovie);
    }, 100);
  };

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
      const mediaType = movie.first_air_date ? 'tv' : 'movie';
      const [movieDetails, castData, providers] = await Promise.all([
        fetchMovieDetails(movie.id, mediaType),
        fetchCast(movie.id, mediaType),
        fetchWatchProviders(movie.id, mediaType)
      ]);
      if (movieDetails) {
        setDetails(movieDetails);
      }
      if (castData) {
        setCast(castData.slice(0, 10)); // Get top 10 cast members
      }
      if (providers) {
        setWatchProviders(providers);
      }
      setLoading(false);
    };
    getDetails();
  }, [movie]);

  const checkCastScroll = () => {
    if (castScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = castScrollRef.current;
      setCastScrollLeft(scrollLeft > 0);
      setCastScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const scroller = castScrollRef.current;
    if (scroller && cast.length > 0) {
      scroller.addEventListener('scroll', checkCastScroll);
      setTimeout(checkCastScroll, 100);
    }
    return () => {
      if (scroller) {
        scroller.removeEventListener('scroll', checkCastScroll);
      }
    };
  }, [cast]);

  const scrollCast = (direction: 'left' | 'right') => {
    if (castScrollRef.current) {
      const { scrollLeft, clientWidth } = castScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      castScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const backgroundImageUrl = movie.backdrop_path || movie.poster_path 
    ? `url(${IMAGE_BASE_URL}original${movie.backdrop_path || movie.poster_path})`
    : 'none';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <div className="bg-brand-black w-full max-w-4xl rounded-lg overflow-hidden mx-2 md:mx-4 my-4 md:my-8 relative max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 text-white z-50 bg-black/50 rounded-full p-1" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-brand-black p-4 md:p-8">
             <h2 className="text-xl md:text-3xl lg:text-4xl font-bold">{movie.title || movie.name}</h2>
          </div>
        </div>
        <div className="p-4 md:p-8 space-y-3 md:space-y-4 max-h-[40vh] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
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
          <p className="text-sm md:text-base lg:text-lg leading-relaxed">{movie.overview}</p>
          {details?.genres && details.genres.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-gray-400">Genres: </span>
              <span className="text-white">{details.genres.map(genre => genre.name).join(', ')}</span>
            </div>
          )}
          {details?.production_companies && details.production_companies.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-gray-400">Production: </span>
              <span className="text-white">{details.production_companies.slice(0, 3).map(company => company.name).join(', ')}</span>
            </div>
          )}
          {details?.spoken_languages && details.spoken_languages.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-gray-400">Available Languages: </span>
              <span className="text-white">{details.spoken_languages.map((lang: any) => lang.english_name || lang.name).join(', ')}</span>
            </div>
          )}
          {details?.status && (
            <div className="text-sm md:text-base">
              <span className="text-gray-400">Status: </span>
              <span className="text-white">{details.status}</span>
            </div>
          )}
          {watchProviders && (watchProviders.US || watchProviders.IN || watchProviders.GB || watchProviders.CA) && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-base md:text-lg font-semibold text-white">Available On</h3>
              <div className="space-y-3">
                {['US', 'IN', 'GB', 'CA'].map(country => {
                  const countryData = watchProviders[country];
                  if (!countryData?.flatrate && !countryData?.buy && !countryData?.rent) return null;
                  
                  const countryNames: Record<string, string> = {
                    'US': '🇺🇸 United States',
                    'IN': '🇮🇳 India',
                    'GB': '🇬🇧 United Kingdom',
                    'CA': '🇨🇦 Canada'
                  };
                  
                  return (
                    <div key={country} className="space-y-2">
                      <p className="text-xs md:text-sm font-semibold text-gray-300">{countryNames[country]}</p>
                      <div className="flex flex-wrap gap-2">
                        {countryData.flatrate?.slice(0, 6).map((provider: any) => (
                          <div key={provider.provider_id} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1">
                            <img
                              src={`${IMAGE_BASE_URL}w45${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="w-6 h-6 md:w-8 md:h-8 rounded"
                              loading="lazy"
                            />
                            <span className="text-xs md:text-sm text-white">{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {cast.length > 0 && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-base md:text-lg font-semibold text-white">Cast</h3>
              <div className="relative group">
                {castScrollLeft && (
                  <button 
                    onClick={() => scrollCast('left')} 
                    aria-label="Scroll cast left"
                    className="absolute top-0 bottom-0 left-0 z-40 m-auto h-8 w-8 md:h-9 md:w-9 cursor-pointer opacity-0 group-hover:opacity-80 hover:scale-125 hover:opacity-100 transition-all flex items-center justify-center bg-black/60 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                <div 
                  ref={castScrollRef}
                  className="flex overflow-x-scroll gap-3 md:gap-4 pb-2 scrollbar-hide"
                  onScroll={checkCastScroll}
                >
                  {cast.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex-shrink-0 w-24 md:w-32 cursor-pointer transition-transform hover:scale-105"
                      onClick={() => setSelectedCastId(member.id)}
                    >
                      <div className="relative aspect-[2/3] mb-2 rounded-md overflow-hidden bg-gray-800">
                        {member.profile_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}w185${member.profile_path}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-white truncate">{member.name}</p>
                      <p className="text-xs text-gray-400 truncate">{member.character}</p>
                    </div>
                  ))}
                </div>
                {castScrollRight && (
                  <button 
                    onClick={() => scrollCast('right')} 
                    aria-label="Scroll cast right"
                    className="absolute top-0 bottom-0 right-0 z-40 m-auto h-8 w-8 md:h-9 md:w-9 cursor-pointer opacity-0 group-hover:opacity-80 hover:scale-125 hover:opacity-100 transition-all flex items-center justify-center bg-black/60 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedCastId && (
        <CastModal 
          castId={selectedCastId} 
          onClose={() => setSelectedCastId(null)}
          onSelectMovie={handleNewMovieSelect}
        />
      )}
    </div>
  );
};

export default MovieModal;