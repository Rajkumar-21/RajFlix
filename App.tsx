import React, { useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import Row from './components/Row';
import MovieModal from './components/MovieModal';
import AiSuggester from './components/AiSuggester';
import SearchResults from './components/SearchResults';
import AboutModal from './components/AboutModal'; // Import AboutModal
import GenreView from './components/GenreView';
import { tmdbRequests } from './services/tmdbService';
import type { Movie } from './types';

export type View = 'home' | 'movies' | 'tv' | 'genre';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false); // State for About Modal

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
    setSelectedGenreId(null); // Clear genre selection
    setCurrentView(view);
  };

  const handleGenreSelect = (genreId: number) => {
    setSearchQuery(''); // Clear search
    setSelectedGenreId(genreId);
    setCurrentView('genre');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'genre':
        if (!selectedGenreId) return null;
        return <GenreView genreId={selectedGenreId} onSelectMovie={handleSelectMovie} />;
      case 'tv':
        return (
          <>
            <Banner onSelectMovie={handleSelectMovie} fetchUrl={tmdbRequests.fetchNetflixOriginals} />
            <section className="space-y-8 md:space-y-12">
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
            <section className="space-y-8 md:space-y-12">
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
            <section className="space-y-8 md:space-y-12">
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
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onSearch={handleSearch}
        onGenreSelect={handleGenreSelect}
        selectedGenreId={selectedGenreId}
        onOpenAbout={() => setIsAboutModalOpen(true)} // Pass handler to Header
      />
      <main className="relative pl-4 pb-8 lg:pl-16">
        {searchQuery ? (
          <SearchResults query={searchQuery} onSelectMovie={handleSelectMovie} />
        ) : (
          renderContent()
        )}
      </main>
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} onSelectMovie={handleSelectMovie} />}
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />} {/* Render About Modal */}
    </div>
  );
};

export default App;