import { useState } from 'react';
import { BookmarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MovieGrid from '../components/MovieGrid';
import MovieModal from '../components/MovieModal';

export default function Watchlist() {
  const { watchlist } = useApp();
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <main className="page-main">
      <section className="watchlist-header">
        <div className="watchlist-header-content">
          <div className="watchlist-icon-wrap">
            <BookmarkIcon className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h1 className="watchlist-title">My Watchlist</h1>
            <p className="watchlist-subtitle">
              {watchlist.length === 0
                ? 'Your watchlist is empty'
                : `${watchlist.length} ${watchlist.length === 1 ? 'movie' : 'movies'} saved`}
            </p>
          </div>
        </div>
      </section>

      <section className="movies-section">
        {watchlist.length === 0 ? (
          <div className="watchlist-empty">
            <div className="watchlist-empty-icon">🎬</div>
            <h2 className="watchlist-empty-title">Nothing saved yet</h2>
            <p className="watchlist-empty-text">
              Browse trending movies and click the bookmark icon to add them here.
            </p>
            <Link to="/" className="watchlist-cta">
              <MagnifyingGlassIcon className="w-5 h-5" />
              Browse Movies
            </Link>
          </div>
        ) : (
          <MovieGrid
            movies={watchlist}
            onSelectMovie={setSelectedMovie}
            sectionTitle="Saved Movies"
            emptyMessage="Your watchlist is empty."
          />
        )}
      </section>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  );
}
