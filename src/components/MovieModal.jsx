import { useEffect, useState, useCallback } from 'react';
import {
  XMarkIcon,
  StarIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  FilmIcon,
  TrophyIcon,
} from '@heroicons/react/24/solid';
import { getMovieDetails } from '../api/omdb';
import { useApp } from '../context/AppContext';

const FALLBACK_POSTER = 'https://placehold.co/300x450/1a1a2e/a78bfa?text=No+Poster';

export default function MovieModal({ movie, onClose }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const inWatchlist = isInWatchlist(movie.id);

  useEffect(() => {
    setLoading(true);
    setDetails(null);
    getMovieDetails(movie.id)
      .then(setDetails)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [movie.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleWatchlistToggle = useCallback(() => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(details || movie);
    }
  }, [inWatchlist, movie, details, addToWatchlist, removeFromWatchlist]);

  // Use detail data when loaded, otherwise fall back to card data
  const d = details || movie;
  const posterUrl = d.posterUrl && !imgError ? d.posterUrl : FALLBACK_POSTER;
  const rating = d.vote_average != null ? d.vote_average.toFixed(1) : null;
  const year = d.year || (d.release_date ? d.release_date.split('-')[0] : '—');
  const genres = details?.genres || [];
  const actors = details?.actors || [];

  const getRatingClass = (r) => {
    const n = parseFloat(r);
    if (n >= 7.5) return 'rating-high';
    if (n >= 5.5) return 'rating-mid';
    return 'rating-low';
  };

  const formatRuntime = (mins) => {
    if (!mins) return null;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`${movie.title} details`}
    >
      <div className="modal-container">
        {/* Header band (no backdrop for OMDb free tier — use gradient instead) */}
        <div className="modal-backdrop-img modal-backdrop-gradient-only">
          <div className="modal-backdrop-gradient" />
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <div className="modal-top">
            {/* Poster */}
            <div className="modal-poster-wrapper">
              <img
                src={posterUrl}
                alt={d.title}
                className="modal-poster"
                onError={() => setImgError(true)}
              />
            </div>

            {/* Info */}
            <div className="modal-info">
              <h2 className="modal-title">{d.title}</h2>

              {details?.rated && (
                <span className="modal-rated-badge">{details.rated}</span>
              )}

              {/* Meta row */}
              <div className="modal-meta">
                {rating && (
                  <span className={`meta-pill ${getRatingClass(rating)}`}>
                    <StarIcon className="w-4 h-4" />
                    {rating} IMDb
                  </span>
                )}
                <span className="meta-pill meta-pill-neutral">
                  <CalendarIcon className="w-4 h-4" />
                  {year}
                </span>
                {details?.runtime && (
                  <span className="meta-pill meta-pill-neutral">
                    <ClockIcon className="w-4 h-4" />
                    {formatRuntime(details.runtime)}
                  </span>
                )}
              </div>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="modal-genres">
                  {genres.map((g) => (
                    <span key={g.name} className="genre-tag">{g.name}</span>
                  ))}
                </div>
              )}

              {/* Overview / Plot */}
              {!loading && (
                <p className="modal-overview">
                  {d.overview || 'No plot summary available.'}
                </p>
              )}
              {loading && (
                <div className="space-y-2 mt-3">
                  {[85, 65, 45].map((w) => (
                    <div
                      key={w}
                      className="skeleton-line"
                      style={{ height: '13px', width: `${w}%`, borderRadius: '4px' }}
                    />
                  ))}
                </div>
              )}

              {/* Director */}
              {details?.director && (
                <div className="modal-director">
                  <FilmIcon className="w-3.5 h-3.5 text-violet-400" />
                  <span className="modal-director-label">Director</span>
                  <span className="modal-director-name">{details.director}</span>
                </div>
              )}

              {/* Awards */}
              {details?.awards && (
                <div className="modal-awards">
                  <TrophyIcon className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="modal-awards-text">{details.awards}</span>
                </div>
              )}

              {/* Box Office */}
              {details?.boxOffice && (
                <div className="modal-boxoffice">
                  <span className="modal-boxoffice-label">Box Office</span>
                  <span className="modal-boxoffice-value">{details.boxOffice}</span>
                </div>
              )}

              {/* Watchlist Button */}
              <button
                className={`watchlist-btn ${inWatchlist ? 'watchlist-btn-remove' : 'watchlist-btn-add'}`}
                onClick={handleWatchlistToggle}
                id="modal-watchlist-btn"
              >
                {inWatchlist ? (
                  <>
                    <BookmarkSlashIcon className="w-5 h-5" />
                    Remove from Watchlist
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="w-5 h-5" />
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cast */}
          {actors.length > 0 && (
            <div className="modal-cast-section">
              <h3 className="cast-title">
                <UserIcon className="w-4 h-4 inline mr-2 text-violet-400" />
                Cast
              </h3>
              <div className="cast-chips">
                {actors.map((name) => (
                  <span key={name} className="cast-chip">{name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
