import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-bg/40 backdrop-blur-md py-12 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-3.5">
          <Link to="/" className="flex items-center gap-1.5 text-md font-bold tracking-wider uppercase text-white">
            <span className="text-2xl">🎥</span>
            <span>Movie<span className="text-brand-yellow">Lens</span></span>
          </Link>
          <p className="text-brand-gray text-[13px] leading-relaxed max-w-xs">
            Search, browse, compare ratings, and build your personal cinematic library in a sleek, lightweight platform.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3.5 items-center mt-1">
            <a href="https://github.com/lavtiwari-dev" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-yellow hover:text-brand-yellow flex items-center justify-center text-sm transition-all" aria-label="GitHub">
              <span>🐙</span>
            </a>
            <a href="https://linkedin.com/in/lavtiwaridev" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-yellow hover:text-brand-yellow flex items-center justify-center text-sm transition-all" aria-label="LinkedIn">
              <span>💼</span>
            </a>
            <a href="https://www.lavtiwari.dev" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-yellow hover:text-brand-yellow flex items-center justify-center text-sm transition-all" aria-label="Website">
              <span>🌐</span>
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-brand-primary font-semibold text-xs tracking-widest uppercase">Navigation</h4>
          <ul className="flex flex-col gap-2 text-[13px] text-brand-gray">
            <li><Link to="/" className="hover:text-brand-yellow transition-colors">Home</Link></li>
            <li><Link to="/movies" className="hover:text-brand-yellow transition-colors">Movies</Link></li>
            <li><Link to="/genres" className="hover:text-brand-yellow transition-colors">Genres</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-brand-primary font-semibold text-xs tracking-widest uppercase">Resources</h4>
          <ul className="flex flex-col gap-2 text-[13px] text-brand-gray">
            <li><a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">OMDb API</a></li>
            <li><a href="https://github.com/lavtiwari-dev" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">GitHub</a></li>
            <li><Link to="/about" className="hover:text-brand-yellow transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-brand-primary font-semibold text-xs tracking-widest uppercase">Contact</h4>
          <p className="text-brand-gray text-[13px]">
            Inquiries or feedback:
          </p>
          <a href="mailto:support@lavtiwari.dev" className="text-brand-yellow hover:underline font-medium text-[14px] transition-all">
            support@lavtiwari.dev
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 border-t border-brand-border/40 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-brand-gray/60">
        <span>© {new Date().getFullYear()} MovieLens. All rights reserved.</span>
        <span>Powered by OMDb API & Gemini</span>
      </div>
    </footer>
  );
}
