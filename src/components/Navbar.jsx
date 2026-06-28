import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/genres', label: 'Genres' },
    { to: '/favorites', label: 'Favorites' },
    { to: '/about', label: 'About' },
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
    }
  };

  return (
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
              className={({ isActive }) =>
                `nav-underline-btn text-[13px] tracking-widest uppercase font-medium ${
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
          <form onSubmit={handleSearchSubmit} className="hidden sm:block relative search-expandable border border-brand-border/60 rounded-full bg-brand-bg/40 focus-within:bg-brand-bg/70 overflow-hidden w-60 lg:w-68">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search movies..."
              className="w-full bg-transparent pl-4 pr-9 py-1.5 text-xs text-brand-primary focus:outline-none placeholder-brand-gray/80"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-yellow transition-colors">
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-brand-bg/95 border-b border-brand-border py-5 px-6 flex flex-col gap-5 animate-fade-in shadow-2xl backdrop-blur-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative border border-brand-border rounded-full bg-brand-card overflow-hidden w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search movies..."
              className="w-full bg-transparent pl-4 pr-10 py-2.5 text-xs text-brand-primary focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-yellow">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </form>

          {/* Links Grid */}
          <div className="flex flex-col gap-3">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-xs tracking-wider uppercase font-semibold py-2 border-b border-brand-border/20 transition-colors ${
                    isActive ? 'text-brand-yellow' : 'text-brand-gray hover:text-brand-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
