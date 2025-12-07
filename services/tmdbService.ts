import type { Movie } from '../types';

const TMDB_API_KEY = 'dcf4bf4db5e5cc2ee91da5557c4e8155';
const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export interface Genre {
  id: number;
  name: string;
}

export const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
  { id: 10759, name: 'Action & Adventure' }, // TV specific
  { id: 10762, name: 'Kids' }, // TV specific
  { id: 10763, name: 'News' }, // TV specific
  { id: 10764, name: 'Reality' }, // TV specific
  { id: 10765, name: 'Sci-Fi & Fantasy' }, // TV specific
  { id: 10766, name: 'Soap' }, // TV specific
  { id: 10767, name: 'Talk' }, // TV specific
  { id: 10768, name: 'War & Politics' }, // TV specific
];

export const getGenreUrl = (genreId: number, mediaType: 'movie' | 'tv' | 'all' = 'all'): string => {
  if (mediaType === 'all') {
    return `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;
  }
  return `${API_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;
};

export const tmdbRequests = {
  // General
  fetchTrending: `${API_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`,
  
  // Movies
  fetchTopRated: `${API_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`,
  fetchActionMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`,
  fetchComedyMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`,
  fetchHorrorMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`,
  fetchRomanceMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`,
  fetchDocumentaries: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`,

  // TV Shows
  fetchTopRatedTv: `${API_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US`,
  fetchActionAdventureTv: `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10759`,
  fetchComedyTv: `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=35`,
  fetchSciFiTv: `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10765`,
  fetchDocumentaryTv: `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=99`,
};

export const fetchMovies = async (url: string): Promise<Movie[]> => {
  if (!url) return [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching movies: ${response.statusText}`, errorData.status_message);
      return [];
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout - please check your connection');
    } else {
      console.error('Error fetching movies:', error);
    }
    return [];
  }
};

export const fetchMovieDetails = async (id: number, media_type: 'movie' | 'tv' = 'movie'): Promise<Movie | null> => {
  const url = `${API_BASE_URL}/${media_type}/${id}?api_key=${TMDB_API_KEY}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('Error fetching movie details:', response.statusText);
      return null;
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout for movie details');
    } else {
      console.error('Error fetching movie details:', error);
    }
    return null;
  }
};

export const fetchCast = async (id: number, media_type: 'movie' | 'tv' = 'movie'): Promise<any[]> => {
  const url = `${API_BASE_URL}/${media_type}/${id}/credits?api_key=${TMDB_API_KEY}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('Error fetching cast:', response.statusText);
      return [];
    }
    const data = await response.json();
    return data.cast || [];
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout for cast');
    } else {
      console.error('Error fetching cast:', error);
    }
    return [];
  }
};

export const fetchWatchProviders = async (id: number, media_type: 'movie' | 'tv' = 'movie'): Promise<any> => {
  const url = `${API_BASE_URL}/${media_type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('Error fetching watch providers:', response.statusText);
      return null;
    }
    const data = await response.json();
    // Return providers for US, IN (India), GB (UK), CA (Canada)
    return data.results;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout for watch providers');
    } else {
      console.error('Error fetching watch providers:', error);
    }
    return null;
  }
};

export const searchMovie = async (query: string): Promise<Movie | null> => {
  const url = `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results[0] || null; // Return the first result
  } catch (error) {
    console.error('Error searching for movie:', error);
    return null;
  }
};

export const searchMulti = async (query: string): Promise<Movie[]> => {
  try {
    // Fetch multiple pages for better results
    const pages = [1, 2];
    const allResults: Movie[] = [];
    
    for (const page of pages) {
      const url = `${API_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        // Filter out people or anything without a poster from search results
        const filteredResults = data.results.filter(
          (result: any) => (result.media_type === 'movie' || result.media_type === 'tv') && result.poster_path
        );
        allResults.push(...filteredResults);
      }
    }
    
    // Sort results by relevance and popularity
    const sortedResults = allResults.sort((a, b) => {
      const aTitle = (a.title || a.name || '').toLowerCase();
      const bTitle = (b.title || b.name || '').toLowerCase();
      const searchTerm = query.toLowerCase();
      
      // Exact match gets highest priority
      const aExactMatch = aTitle === searchTerm;
      const bExactMatch = bTitle === searchTerm;
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // Starts with search term gets second priority
      const aStartsWith = aTitle.startsWith(searchTerm);
      const bStartsWith = bTitle.startsWith(searchTerm);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Contains search term at word boundary gets third priority
      const aWordMatch = new RegExp(`\\b${searchTerm}`, 'i').test(aTitle);
      const bWordMatch = new RegExp(`\\b${searchTerm}`, 'i').test(bTitle);
      if (aWordMatch && !bWordMatch) return -1;
      if (!aWordMatch && bWordMatch) return 1;
      
      // Finally sort by popularity
      const aPopularity = a.popularity || 0;
      const bPopularity = b.popularity || 0;
      return bPopularity - aPopularity;
    });
    
    // Remove duplicates based on id and media_type
    const uniqueResults = sortedResults.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id && t.media_type === item.media_type)
    );
    
    return uniqueResults;
  } catch (error) {
    console.error('Error searching multi:', error);
    return [];
  }
};