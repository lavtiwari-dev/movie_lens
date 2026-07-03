import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkSlashIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';

export default function Favorites() {
  const { favorites, removeFromFavorites } = useApp();
  const [sortBy, setSortBy] = useState('added-desc'); // default: Recently Added

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      favorites.forEach((movie) => removeFromFavorites(movie.id));
    }
  };

  const getSortedFavorites = () => {
    let list = [...favorites];

    if (sortBy === 'added-desc') {
      list.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
    } else if (sortBy === 'rating-desc') {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  };

  const sortedList = getSortedFavorites();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex-1 w-full animate-fade-in">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/40 pb-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Watchlist
            </h1>
            <p className="text-brand-gray text-xs md:text-sm mt-1">
              You have {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved in your catalog.
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="dropdown-filter-select py-1.5 text-xs h-9"
                >
                  <option value="added-desc">Recently Added</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="title-asc">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* Clear All */}
              <button
                onClick={handleClearAll}
                className="px-3 py-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 font-semibold text-[10px] uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors h-9"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Grid List */}
        {sortedList.length === 0 ? (
          <div className="glass-panel border border-brand-border rounded-2xl py-20 flex flex-col items-center justify-center text-center">
            <span className="text-5xl mb-3">🎬</span>
            <h2 className="text-lg font-bold text-white mb-1.5">Watchlist is empty</h2>
            <p className="text-brand-gray text-xs max-w-xs mb-6 leading-relaxed">
              Explore films on our homepage or catalog pages, and bookmark them to keep track of your watch candidates.
            </p>
            <Link
              to="/movies"
              className="btn-glow-purple px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {sortedList.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
                  
                  {/* Remove shortcut */}
                  <button
                    onClick={() => removeFromFavorites(movie.id)}
                    className="absolute -top-1.5 -right-1.5 z-20 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg cursor-pointer transition-colors opacity-0 group-hover:opacity-100 duration-200"
                    title="Remove from watchlist"
                  >
                    <BookmarkSlashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
