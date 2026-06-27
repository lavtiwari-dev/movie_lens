import { useEffect, useState, useCallback } from 'react';
import { getFeaturedMovies, searchMovies } from '../api/omdb';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import MovieGrid from '../components/MovieGrid';
import MovieModal from '../components/MovieModal';
import Loader from '../components/Loader';

export default function Home() {
  const { searchQuery, filters } = useApp();
  const [featured, setFeatured] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const isSearching = searchQuery.length > 1;  // OMDb needs at least 2+ chars
  const hasFilters = filters.genre || filters.year || filters.minRating;
  const showFeatured = !isSearching && !hasFilters;

  // Load curated featured movies on mount
  useEffect(() => {
    setLoading(true);
    getFeaturedMovies()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  // Fetch when search query or year filter changes
  // Genre & rating filters are applied client-side after fetch
  useEffect(() => {
    if (!isSearching && !hasFilters) {
      setResults([]);
      return;
    }

    // If only genre/rating filters are set but no search query, filter from featured list
    if (!isSearching && hasFilters) {
      setResults([]);
      return;
    }

    setLoading(true);
    searchMovies(searchQuery, { year: filters.year })
      .then((data) => {
        setResults(data.results || []);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [searchQuery, filters.year, isSearching, hasFilters]);

  // Apply genre + rating filters client-side
  const applyClientFilters = useCallback(
    (movies) => {
      let filtered = movies;
      if (filters.genre) {
        filtered = filtered.filter(
          (m) =>
            m.genres?.some((g) =>
              g.name.toLowerCase().includes(filters.genre.toLowerCase())
            )
        );
      }
      if (filters.minRating) {
        filtered = filtered.filter(
          (m) => m.vote_average != null && m.vote_average >= parseFloat(filters.minRating)
        );
      }
      return filtered;
    },
    [filters.genre, filters.minRating]
  );

  // Decide which list to display
  const baseMovies = showFeatured ? featured : results;
  const displayMovies =
    (filters.genre || filters.minRating) && showFeatured
      ? applyClientFilters(featured)
      : isSearching
      ? results
      : featured;

  const sectionTitle = showFeatured
    ? '⭐ Featured Movies'
    : isSearching
    ? `Results for "${searchQuery}"`
    : '🎬 Movies';

  const emptyMessage = isSearching
    ? `No movies found for "${searchQuery}". Try a different search.`
    : 'No movies match your filters.';

  return (
    <main className="page-main">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Your Next
            <span className="hero-accent"> Favorite Film</span>
          </h1>
          <p className="hero-subtitle">
            Search millions of movies, explore curated picks, and build your personal watchlist — powered by OMDb.
          </p>
          <div className="hero-search-row">
            <SearchBar />
            <Filters />
          </div>
        </div>
      </section>

      {/* Movies */}
      <section className="movies-section">
        {loading ? (
          <Loader count={12} />
        ) : (
          <MovieGrid
            movies={displayMovies}
            onSelectMovie={setSelectedMovie}
            sectionTitle={sectionTitle}
            emptyMessage={emptyMessage}
          />
        )}
      </section>

      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}
