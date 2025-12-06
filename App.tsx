import React, { useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import Row from './components/Row';
import MovieModal from './components/MovieModal';
import AiSuggester from './components/AiSuggester';
import SearchResults from './components/SearchResults';
import { tmdbRequests } from './services/tmdbService';
import type { Movie } from './types';

export type View = 'home' | 'movies' | 'tv';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNavigate = (view: View) => {
    setSearchQuery(''); // Clear search when navigating to a new view
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'tv':
        return (
          <>
            <Banner onSelectMovie={handleSelectMovie} fetchUrl={tmdbRequests.fetchNetflixOriginals} />
            <section className="md:space-y-16">
              <Row title="Top Rated TV Shows" fetchUrl={tmdbRequests.fetchTopRatedTv} onSelectMovie={handleSelectMovie} isLargeRow />
              <Row title="Action & Adventure" fetchUrl={tmdbRequests.fetchActionAdventureTv} onSelectMovie={handleSelectMovie} />
              <Row title="Comedy TV Shows" fetchUrl={tmdbRequests.fetchComedyTv} onSelectMovie={handleSelectMovie} />
              <Row title="Sci-Fi & Fantasy" fetchUrl={tmdbRequests.fetchSciFiTv} onSelectMovie={handleSelectMovie} />
              <Row title="Documentaries" fetchUrl={tmdbRequests.fetchDocumentaryTv} onSelectMovie={handleSelectMovie} />
            </section>
          </>
        );
      case 'movies':
        return (
          <>
            <Banner onSelectMovie={handleSelectMovie} fetchUrl={tmdbRequests.fetchTopRated} />
            <section className="md:space-y-16">
               <Row title="Top Rated Movies" fetchUrl={tmdbRequests.fetchTopRated} onSelectMovie={handleSelectMovie} isLargeRow />
               <Row title="Action Movies" fetchUrl={tmdbRequests.fetchActionMovies} onSelectMovie={handleSelectMovie} />
               <Row title="Comedy Movies" fetchUrl={tmdbRequests.fetchComedyMovies} onSelectMovie={handleSelectMovie} />
               <Row title="Horror Movies" fetchUrl={tmdbRequests.fetchHorrorMovies} onSelectMovie={handleSelectMovie} />
               <Row title="Romance Movies" fetchUrl={tmdbRequests.fetchRomanceMovies} onSelectMovie={handleSelectMovie} />
            </section>
          </>
        );
      case 'home':
      default:
        return (
          <>
            <Banner onSelectMovie={handleSelectMovie} />
            <AiSuggester onSelectMovie={handleSelectMovie} />
            <section className="md:space-y-16">
              <Row title="Trending Now" fetchUrl={tmdbRequests.fetchTrending} onSelectMovie={handleSelectMovie} />
              <Row title="Netflix Originals" fetchUrl={tmdbRequests.fetchNetflixOriginals} onSelectMovie={handleSelectMovie} isLargeRow />
              <Row title="Top Rated" fetchUrl={tmdbRequests.fetchTopRated} onSelectMovie={handleSelectMovie} />
              <Row title="Action Movies" fetchUrl={tmdbRequests.fetchActionMovies} onSelectMovie={handleSelectMovie} />
              <Row title="Comedy Movies" fetchUrl={tmdbRequests.fetchComedyMovies} onSelectMovie={handleSelectMovie} />
              <Row title="Documentaries" fetchUrl={tmdbRequests.fetchDocumentaries} onSelectMovie={handleSelectMovie} />
            </section>
          </>
        );
    }
  };

  return (
    <div className="relative bg-brand-black min-h-screen text-white">
      <Header currentView={currentView} onNavigate={handleNavigate} onSearch={handleSearch} />
      <main className="relative pl-4 pb-8 lg:space-y-24 lg:pl-16">
        {searchQuery ? (
          <SearchResults query={searchQuery} onSelectMovie={handleSelectMovie} />
        ) : (
          renderContent()
        )}
      </main>
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;