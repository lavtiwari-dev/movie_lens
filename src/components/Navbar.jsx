import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  FilmIcon,
  Squares2X2Icon,
  BookmarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/movies', label: 'Movies', icon: FilmIcon },
    { to: '/genres', label: 'Genres', icon: Squares2X2Icon },
    { to: '/favorites', label: 'Favorites', icon: BookmarkIcon },
    { to: '/about', label: 'About', icon: InformationCircleIcon },
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      navigate('/search');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate('/search');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="navbar sticky top-0 z-50 glass-panel border-b border-brand-border backdrop-blur-lg">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left Section: Logo */}
          <Link to="/" className="logo-link flex items-center gap-1.5 text-lg font-bold tracking-wider uppercase text-white shrink-0">
            <span className="logo-reel text-brand-yellow font-semibold text-2xl">🎥</span>
            <span className="font-bold">Movie<span className="text-brand-yellow font-semibold">Lens</span></span>
          </Link>

          {/* Center Section: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-underline-btn text-base tracking-wide uppercase font-semibold ${
                    isActive ? 'nav-underline-btn-active' : ''
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Section: Search & Hamburger */}
          <div className="flex items-center gap-4">
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:block relative search-expandable border border-brand-border/60 rounded-full bg-brand-bg/40 focus-within:bg-brand-bg/70 overflow-hidden w-72 lg:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search movies..."
                className="w-full bg-transparent pl-5 pr-10 py-2.5 text-sm text-brand-primary focus:outline-none placeholder-brand-gray/80"
              />
              <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-yellow transition-colors">
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </form>

            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-brand-primary hover:text-brand-yellow p-1 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
          className="lg:hidden fixed inset-0 top-16 bg-brand-bg/98 z-50 flex flex-col justify-start px-6 py-8 gap-6 animate-fade-in backdrop-blur-2xl overflow-y-auto"
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative border border-brand-border rounded-2xl bg-brand-card/60 overflow-hidden w-full focus-within:border-brand-yellow/50 transition-colors">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search movies..."
              className="w-full bg-transparent pl-5 pr-12 py-3.5 text-sm text-brand-primary focus:outline-none placeholder-brand-gray/60"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-yellow transition-colors">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </form>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl border border-brand-border/30 bg-brand-card/30 transition-all ${
                    isActive 
                      ? 'border-brand-yellow/40 bg-brand-yellow/5 text-brand-yellow font-bold shadow-md' 
                      : 'text-brand-gray hover:text-brand-primary hover:bg-brand-card/50'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm tracking-wider uppercase font-semibold">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
