import { useState } from 'react';
import { StarIcon, BookmarkIcon, BookmarkSlashIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

const FALLBACK_POSTER = 'https://placehold.co/300x450/1a1a2e/a78bfa?text=No+Poster';

export default function MovieCard({ movie, onSelect }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWatchlist = isInWatchlist(movie.id);

  // posterUrl is a direct URL from OMDb (no path construction needed)
  const posterUrl = movie.posterUrl && !imgError ? movie.posterUrl : FALLBACK_POSTER;

  const rating = movie.vote_average != null ? movie.vote_average.toFixed(1) : null;
  const year = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '—');

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const getRatingClass = (r) => {
    const n = parseFloat(r);
    if (n >= 7.5) return 'rating-high';
    if (n >= 5.5) return 'rating-mid';
    return 'rating-low';
  };

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(movie)}
      aria-label={`View details for ${movie.title}`}
    >
      {/* Poster */}
      <div className="movie-card-poster-wrapper">
        <img
          src={posterUrl}
          alt={movie.title}
          className="movie-card-poster"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className={`movie-card-overlay ${isHovered ? 'movie-card-overlay-visible' : ''}`}>
          <button
            className="overlay-btn overlay-btn-primary"
            onClick={(e) => { e.stopPropagation(); onSelect(movie); }}
            aria-label="View details"
          >
            <EyeIcon className="w-4 h-4" />
            View Details
          </button>
          <button
            className={`overlay-btn ${inWatchlist ? 'overlay-btn-danger' : 'overlay-btn-secondary'}`}
            onClick={handleWatchlistToggle}
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inWatchlist ? (
              <>
                <BookmarkSlashIcon className="w-4 h-4" />
                Remove
              </>
            ) : (
              <>
                <BookmarkIcon className="w-4 h-4" />
                Watchlist
              </>
            )}
          </button>
        </div>

        {/* Rating Badge — only shown when rating is available */}
        {rating && (
          <div className={`rating-badge ${getRatingClass(rating)}`}>
            <StarIcon className="w-3 h-3" />
            {rating}
          </div>
        )}

        {/* Watchlist Indicator */}
        {inWatchlist && (
          <div className="watchlist-indicator">
            <BookmarkIcon className="w-4 h-4 text-violet-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <span className="movie-card-year">{year}</span>
      </div>
    </div>
  );
}
