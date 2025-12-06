import React, { useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import Row from './components/Row';
import MovieModal from './components/MovieModal';
import AiSuggester from './components/AiSuggester';
import ApiKeyModal from './components/ApiKeyModal';
import { getTmdbRequests, setTmdbApiKey, hasTmdbApiKey } from './services/tmdbService';
import type { Movie } from './types';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isKeySet, setIsKeySet] = useState(hasTmdbApiKey());

  const handleApiKeySubmit = (apiKey: string) => {
    setTmdbApiKey(apiKey);
    setIsKeySet(true);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  if (!isKeySet) {
    return <ApiKeyModal onApiKeySubmit={handleApiKeySubmit} />;
  }

  const tmdbRequests = getTmdbRequests();

  return (
    <div className="relative bg-brand-black min-h-screen text-white">
      <Header />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Banner onSelectMovie={handleSelectMovie} />
        <section className="md:space-y-16">
          <Row title="Trending Now" fetchUrl={tmdbRequests.fetchTrending} onSelectMovie={handleSelectMovie} />
          <Row title="Netflix Originals" fetchUrl={tmdbRequests.fetchNetflixOriginals} onSelectMovie={handleSelectMovie} isLargeRow />
          <Row title="Top Rated" fetchUrl={tmdbRequests.fetchTopRated} onSelectMovie={handleSelectMovie} />
          <Row title="Action Movies" fetchUrl={tmdbRequests.fetchActionMovies} onSelectMovie={handleSelectMovie} />
          <Row title="Comedy Movies" fetchUrl={tmdbRequests.fetchComedyMovies} onSelectMovie={handleSelectMovie} />
          <Row title="Horror Movies" fetchUrl={tmdbRequests.fetchHorrorMovies} onSelectMovie={handleSelectMovie} />
          <Row title="Romance Movies" fetchUrl={tmdbRequests.fetchRomanceMovies} onSelectMovie={handleSelectMovie} />
          <Row title="Documentaries" fetchUrl={tmdbRequests.fetchDocumentaries} onSelectMovie={handleSelectMovie} />
        </section>
        <AiSuggester onSelectMovie={handleSelectMovie} />
      </main>
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
