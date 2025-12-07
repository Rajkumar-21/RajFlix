import React, { useState, useEffect, useRef } from 'react';
import { IMAGE_BASE_URL } from '../services/tmdbService';
import type { Movie } from '../types';

interface CastModalProps {
  castId: number;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  also_known_as: string[];
}

interface CastCredit {
  id: number;
  title?: string;
  name?: string;
  character: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

const CastModal: React.FC<CastModalProps> = ({ castId, onClose, onSelectMovie }) => {
  const [details, setDetails] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<CastCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const creditsScrollRef = useRef<HTMLDivElement>(null);
  const [creditsScrollLeft, setCreditsScrollLeft] = useState(false);
  const [creditsScrollRight, setCreditsScrollRight] = useState(false);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      setLoading(true);
      try {
        const TMDB_API_KEY = 'dcf4bf4db5e5cc2ee91da5557c4e8155';
        const API_BASE_URL = 'https://api.themoviedb.org/3';
        
        const [personResponse, creditsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/person/${castId}?api_key=${TMDB_API_KEY}`),
          fetch(`${API_BASE_URL}/person/${castId}/combined_credits?api_key=${TMDB_API_KEY}`)
        ]);

        if (personResponse.ok && creditsResponse.ok) {
          const personData = await personResponse.json();
          const creditsData = await creditsResponse.json();
          
          setDetails(personData);
          
          // Sort by popularity and get top 10
          const sortedCredits = creditsData.cast
            .filter((credit: any) => credit.poster_path)
            .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0))
            .slice(0, 10);
          
          setCredits(sortedCredits);
        }
      } catch (error) {
        console.error('Error fetching person details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [castId]);

  const checkCreditsScroll = () => {
    if (creditsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = creditsScrollRef.current;
      setCreditsScrollLeft(scrollLeft > 0);
      setCreditsScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const scroller = creditsScrollRef.current;
    if (scroller && credits.length > 0) {
      scroller.addEventListener('scroll', checkCreditsScroll);
      setTimeout(checkCreditsScroll, 100);
    }
    return () => {
      if (scroller) {
        scroller.removeEventListener('scroll', checkCreditsScroll);
      }
    };
  }, [credits]);

  const scrollCredits = (direction: 'left' | 'right') => {
    if (creditsScrollRef.current) {
      const { scrollLeft, clientWidth } = creditsScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      creditsScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const calculateAge = (birthday: string | null) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleMovieClick = (credit: CastCredit) => {
    // Convert CastCredit to Movie format
    const movie: Movie = {
      id: credit.id,
      title: credit.title || '',
      name: credit.name,
      original_name: credit.name,
      overview: '',
      poster_path: credit.poster_path || '',
      backdrop_path: '',
      vote_average: credit.vote_average,
      release_date: credit.release_date,
      first_air_date: credit.first_air_date,
      genre_ids: [],
      media_type: credit.first_air_date ? 'tv' : 'movie'
    };
    onSelectMovie(movie);
    onClose(); // Close cast modal when selecting a movie
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-2 md:p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-brand-black w-full max-w-3xl rounded-lg overflow-hidden mx-2 md:mx-4 my-4 md:my-8 relative max-h-[95vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 md:top-4 md:right-4 text-white z-50 bg-black/50 rounded-full p-1" 
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-t-brand-red border-gray-600 rounded-full animate-spin"></div>
          </div>
        ) : details ? (
          <>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                {details.profile_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}w300${details.profile_path}`}
                    alt={details.name}
                    className="w-48 md:w-64 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-48 md:w-64 h-72 md:h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 md:space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{details.name}</h2>
                
                <div className="space-y-2 text-sm md:text-base">
                  {details.known_for_department && (
                    <div>
                      <span className="text-gray-400">Known For: </span>
                      <span className="text-white">{details.known_for_department}</span>
                    </div>
                  )}
                  
                  {details.birthday && (
                    <div>
                      <span className="text-gray-400">Born: </span>
                      <span className="text-white">
                        {new Date(details.birthday).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {calculateAge(details.birthday) && ` (${calculateAge(details.birthday)} years old)`}
                      </span>
                    </div>
                  )}
                  
                  {details.place_of_birth && (
                    <div>
                      <span className="text-gray-400">Place of Birth: </span>
                      <span className="text-white">{details.place_of_birth}</span>
                    </div>
                  )}

                  {details.also_known_as && details.also_known_as.length > 0 && (
                    <div>
                      <span className="text-gray-400">Also Known As: </span>
                      <span className="text-white">{details.also_known_as.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                </div>

                {details.biography && (
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-semibold text-white">Biography</h3>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed max-h-48 overflow-y-auto">
                      {details.biography}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {credits.length > 0 && (
              <div className="p-4 md:p-8 pt-0 space-y-3">
                <h3 className="text-lg md:text-xl font-semibold text-white">Known For</h3>
                <div className="relative group">
                  {creditsScrollLeft && (
                    <button 
                      onClick={() => scrollCredits('left')} 
                      aria-label="Scroll credits left"
                      className="absolute top-0 bottom-0 left-0 z-40 m-auto h-8 w-8 md:h-9 md:w-9 cursor-pointer opacity-0 group-hover:opacity-80 hover:scale-125 hover:opacity-100 transition-all flex items-center justify-center bg-black/60 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}
                  <div 
                    ref={creditsScrollRef}
                    className="flex overflow-x-scroll gap-3 pb-2 scrollbar-hide"
                    onScroll={checkCreditsScroll}
                  >
                    {credits.map((credit) => (
                      <div 
                        key={credit.id} 
                        className="flex-shrink-0 w-32 md:w-40 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => handleMovieClick(credit)}
                      >
                        <div className="relative aspect-[2/3] mb-2 rounded-md overflow-hidden bg-gray-800">
                          <img
                            src={`${IMAGE_BASE_URL}w200${credit.poster_path}`}
                            alt={credit.title || credit.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-white truncate">
                          {credit.title || credit.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{credit.character}</p>
                        {credit.vote_average > 0 && (
                          <p className="text-xs text-green-400">⭐ {credit.vote_average.toFixed(1)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {creditsScrollRight && (
                    <button 
                      onClick={() => scrollCredits('right')} 
                      aria-label="Scroll credits right"
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
          </>
        ) : (
          <div className="p-8 text-center text-gray-400">
            Failed to load cast details
          </div>
        )}
      </div>
    </div>
  );
};

export default CastModal;
