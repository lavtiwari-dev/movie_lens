import { Link, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, BookmarkIcon, FilmIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { theme, toggleTheme, watchlist } = useApp();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <FilmIcon className="w-5 h-5 text-white" />
          </div>
          <span className="brand-text">
            Movie<span className="brand-accent">Finder</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="nav-links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'nav-link-active' : ''}`}
            >
              {label === 'Watchlist' && (
                <span className="relative">
                  <BookmarkIcon className="w-4 h-4 inline mr-1 -mt-0.5" />
                  {watchlist.length > 0 && (
                    <span className="watchlist-badge">{watchlist.length}</span>
                  )}
                </span>
              )}
              {label}
            </Link>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </nav>
  );
}
