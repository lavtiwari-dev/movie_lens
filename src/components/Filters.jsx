import { useState } from 'react';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

// OMDb does not provide a genre list endpoint — using curated static list
const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Music',
  'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western',
];

export default function Filters() {
  const { filters, setFilters, clearFilters } = useApp();
  const [open, setOpen] = useState(false);

  const hasActiveFilters = filters.genre || filters.year || filters.minRating;

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filters-wrapper">
      <button
        className={`filters-toggle ${hasActiveFilters ? 'filters-toggle-active' : ''}`}
        onClick={() => setOpen((o) => !o)}
        id="filters-toggle-btn"
      >
        <AdjustmentsHorizontalIcon className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="filters-count">
            {[filters.genre, filters.year, filters.minRating].filter(Boolean).length}
          </span>
        )}
      </button>

      {open && (
        <div className="filters-panel">
          <div className="filters-panel-header">
            <span className="filters-panel-title">Filter Movies</span>
            <button
              onClick={() => setOpen(false)}
              className="filters-close"
              aria-label="Close filters"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="filters-grid">
            {/* Genre — client-side text filter */}
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-genre">Genre</label>
              <select
                id="filter-genre"
                className="filter-select"
                value={filters.genre || ''}
                onChange={(e) => handleChange('genre', e.target.value)}
              >
                <option value="">All Genres</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Year — passed to OMDb ?y= param */}
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-year">Release Year</label>
              <select
                id="filter-year"
                className="filter-select"
                value={filters.year || ''}
                onChange={(e) => handleChange('year', e.target.value)}
              >
                <option value="">Any Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Min Rating — client-side filter on imdbRating */}
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-rating">
                Min IMDb Rating:{' '}
                <span className="filter-rating-value">
                  {filters.minRating || '0'}/10
                </span>
              </label>
              <input
                id="filter-rating"
                type="range"
                min="0"
                max="9"
                step="1"
                value={filters.minRating || '0'}
                onChange={(e) =>
                  handleChange('minRating', e.target.value === '0' ? '' : e.target.value)
                }
                className="filter-range"
              />
              <div className="filter-range-labels">
                <span>0</span>
                <span>9+</span>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              className="filters-clear-btn"
              onClick={() => { clearFilters(); }}
              id="filters-clear-btn"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
