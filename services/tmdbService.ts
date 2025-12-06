import type { Movie } from '../types';

let TMDB_API_KEY = process.env.TMDB_API_KEY || null;

export const setTmdbApiKey = (key: string) => {
  TMDB_API_KEY = key;
};

export const hasTmdbApiKey = () => !!TMDB_API_KEY;

const API_BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const getTmdbRequests = () => {
  if (!TMDB_API_KEY) {
    return {
      fetchTrending: '',
      fetchNetflixOriginals: '',
      fetchTopRated: '',
      fetchActionMovies: '',
      fetchComedyMovies: '',
      fetchHorrorMovies: '',
      fetchRomanceMovies: '',
      fetchDocumentaries: '',
    };
  }
  return {
    fetchTrending: `${API_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`,
    fetchNetflixOriginals: `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`,
    fetchTopRated: `${API_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`,
    fetchActionMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`,
    fetchComedyMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`,
    fetchHorrorMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`,
    fetchRomanceMovies: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`,
    fetchDocumentaries: `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`,
  };
};

export const fetchMovies = async (url: string): Promise<Movie[]> => {
  if (!TMDB_API_KEY || !url) return [];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching movies: ${response.statusText}`, errorData.status_message);
      return [];
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (id: number, media_type: 'movie' | 'tv' = 'movie'): Promise<(Movie & { videos: { results: any[] } }) | null> => {
  if (!TMDB_API_KEY) return null;
  const url = `${API_BASE_URL}/${media_type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const searchMovie = async (query: string): Promise<Movie | null> => {
  if (!TMDB_API_KEY) return null;
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
