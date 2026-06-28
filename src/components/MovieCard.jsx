import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, BookmarkIcon, BookmarkSlashIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

const FALLBACK_POSTER = 'https://placehold.co/300x450/111115/ffffff?text=No+Poster';

export default function MovieCard({ movie, onSelect }) {
  const { isInFavorites, addToFavorites, removeFromFavorites } = useApp();
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const isFavorite = isInFavorites(movie.id);

  const posterUrl = movie.posterUrl && !imgError ? movie.posterUrl : FALLBACK_POSTER;
  const rating = movie.vote_average != null ? movie.vote_average.toFixed(1) : null;
  const year = movie.year || (movie.release_date ? movie.release_date.split('-')[0] : '—');

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(movie);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div
      className="movie-card-premium group cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`View details for ${movie.title}`}
    >
      {/* Poster Wrapper */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-brand-card">
        <img
          src={posterUrl}
          alt={movie.title}
          className="card-img-zoom w-full h-full object-cover group-hover:scale-105 duration-500"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* IMDb Rating Badge */}
          {rating ? (
            <div className="movie-badge-rating flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-brand-yellow">
              <StarIcon className="w-3 h-3 fill-brand-yellow" />
              <span>{rating}</span>
            </div>
          ) : (
            <div />
          )}

          {/* Bookmark Button */}
          <button
            className="pointer-events-auto w-7.5 h-7.5 rounded-full bg-black/60 border border-white/5 hover:border-brand-yellow hover:text-brand-yellow flex items-center justify-center text-white backdrop-blur-md transition-all shadow-md"
            onClick={handleFavoriteToggle}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <BookmarkSlashIcon className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
            ) : (
              <BookmarkIcon className="w-3.5 h-3.5 text-white/80" />
            )}
          </button>
        </div>

        {/* Hover View Details Button overlay */}
        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
          <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase scale-95 group-hover:scale-100 transition-all duration-350 shadow-lg">
            Details
          </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="pt-3 pb-1 flex flex-col gap-0.5">
        <h3 className="text-[13px] sm:text-[14px] font-semibold text-brand-primary group-hover:text-brand-yellow line-clamp-1 transition-colors duration-200">
          {movie.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-brand-gray font-medium">
          <span>{year}</span>
          <span className="text-brand-muted">•</span>
          <span className="text-[10px] uppercase tracking-wider text-brand-gray/80">
            {movie.type || 'Movie'}
          </span>
        </div>
      </div>
    </div>
  );
}
