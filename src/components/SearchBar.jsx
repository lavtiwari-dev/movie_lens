import { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce input → search query
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(inputValue.trim());
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue, setSearchQuery]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  }, [setSearchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleClear();
  };

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <MagnifyingGlassIcon className="search-icon" />
        <input
          ref={inputRef}
          id="movie-search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for movies, directors, genres..."
          className="search-input"
          autoComplete="off"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="search-clear"
            aria-label="Clear search"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
