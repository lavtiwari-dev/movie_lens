import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Theme (Locked to Dark Mode) ────────────────────────────────────────
  const theme = 'dark';
  const toggleTheme = useCallback(() => {}, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('mf-theme', 'dark');
  }, []);

  // ── Favorites (Watchlist) ──────────────────────────────────────────────
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
      // Add a timestamp to support sorting in Favorites page
      return [...prev, { ...movie, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  // ── Search ─────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        // Expose watchlist API (for backwards compatibility)
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        // Expose favorites API (for new features)
        favorites: watchlist,
        addToFavorites: addToWatchlist,
        removeFromFavorites: removeFromWatchlist,
        isInFavorites: isInWatchlist,
        
        searchQuery,
        setSearchQuery,
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
