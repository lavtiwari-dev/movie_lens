import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Theme ──────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('mf-theme');
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mf-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // ── Watchlist ──────────────────────────────────────────────────────────
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem('mf-watchlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mf-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  // ── Search & Filters ───────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: '' });
  const [selectedMovie, setSelectedMovie] = useState(null);

  const clearFilters = useCallback(() => {
    setFilters({ genre: '', year: '', minRating: '' });
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        clearFilters,
        selectedMovie,
        setSelectedMovie,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
