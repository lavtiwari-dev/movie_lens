import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StarIcon, ArrowRightIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import { getMovieDetails, getTrendingMovies, getLatestReleases } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

export default function Home() {
  const { setSearchQuery } = useApp();
  const navigate = useNavigate();

  // Page States
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local Hero Search State
  const [localSearch, setLocalSearch] = useState('');

  const popularTags = ['Avengers', 'Batman', 'Interstellar', 'Harry Potter', 'Oppenheimer', 'Joker'];

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        // Fetch The Dark Knight details for the Featured Card
        const featuredDetails = await getMovieDetails('tt0468569');
        setFeatured(featuredDetails);

        // Fetch section movies in parallel
        const [trendingData, latestData] = await Promise.all([
          getTrendingMovies(),
          getLatestReleases()
        ]);

        setTrending(trendingData.slice(0, 6));
        setLatest(latestData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim().length > 0) {
      setSearchQuery(localSearch.trim());
      navigate('/search');
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    navigate('/search');
  };

  // Curated genres for landing preview (6 cards)
  const homeGenres = [
    { name: 'Action', count: '1.1K+ Movies', gradient: 'from-red-950/30 to-neutral-950/90', bg: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=500&auto=format&fit=crop&q=60' },
    { name: 'Comedy', count: '1.6K+ Movies', gradient: 'from-amber-950/30 to-neutral-950/90', bg: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=60' },
    { name: 'Adventure', count: '1.5K+ Movies', gradient: 'from-emerald-950/30 to-neutral-950/90', bg: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=500&auto=format&fit=crop&q=60' },
    { name: 'Sci-Fi', count: '80+ Movies', gradient: 'from-blue-950/30 to-neutral-950/90', bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60' },
    { name: 'Animation', count: '380+ Movies', gradient: 'from-pink-950/30 to-neutral-950/90', bg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60' },
    { name: 'Horror', count: '1.3K+ Movies', gradient: 'from-purple-950/40 to-neutral-950/90', bg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop&q=60' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-brand-bg">
      {/* Background glow effects */}
      <div className="hero-bg-glow animate-pulse-slow" />

      {/* Hero Section */}
      <section className="relative max-w-[1440px] mx-auto px-4 md:px-8 pt-8 pb-14 md:py-16 grid grid-cols-1 xl:grid-cols-2 gap-10 items-center z-10 w-full">
        {/* Left Column: Heading & Search */}
        <div className="flex flex-col gap-5 xl:gap-7">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] md:leading-[1.15]">
            Discover films.<br />
            Track <span className="text-brand-yellow">Ratings</span>.
          </h1>
          <p className="text-brand-gray text-[14px] md:text-base leading-relaxed max-w-xl">
            Search titles, browse detailed metrics, compare critic ratings, and curate your ultimate cinematic collection with zero ads.
          </p>

          {/* Large Hero Search Input */}
          <form onSubmit={handleHeroSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full max-w-lg">
            <div className="relative flex-1">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search movies, actors, directors..."
                className="w-full h-12 bg-brand-card border border-brand-border rounded-xl px-4 text-xs text-brand-primary focus:outline-none focus:border-brand-yellow/50 transition-all placeholder-brand-gray/80"
              />
            </div>
            <button
              type="submit"
              className="btn-glow-yellow h-12 px-6 rounded-xl text-black font-semibold text-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray/80 mr-1">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="tag-pill"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Large Featured Movie Card */}
        <div className="w-full flex items-center justify-center xl:justify-end">
          {featured ? (
            <div className="glass-panel border border-brand-border rounded-2xl p-5 flex flex-col sm:flex-row gap-5 w-full max-w-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              {/* Poster */}
              <div className="w-36 sm:w-40 shrink-0 aspect-[2/3] rounded-lg overflow-hidden border border-white/5 mx-auto sm:mx-0 bg-brand-card">
                <img
                  src={featured.posterUrl}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Column */}
              <div className="flex flex-col justify-between gap-3 flex-1 text-left">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-yellow font-bold text-[10px] uppercase tracking-widest">★ Featured choice</span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-brand-yellow">
                      <StarIcon className="w-3.5 h-3.5 fill-brand-yellow" />
                      <span>{featured.vote_average ? `${featured.vote_average}/10` : '—'}</span>
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">{featured.title}</h2>
                  
                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-brand-gray font-medium">
                    <span>{featured.year}</span>
                    <span className="text-brand-muted">•</span>
                    <span>{featured.runtime ? `${featured.runtime} min` : '—'}</span>
                    <span className="text-brand-muted">•</span>
                    <span className="border border-white/10 px-1 rounded-[3px] text-[9px] uppercase font-semibold text-brand-primary bg-white/5">{featured.rated}</span>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {featured.genres.slice(0, 3).map((g) => (
                      <span key={g.name} className="text-[10px] font-semibold text-brand-yellow bg-brand-yellow/5 px-2 py-0.5 rounded-full border border-brand-yellow/10">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  {/* Description plot snippet */}
                  <p className="text-brand-gray text-xs leading-relaxed line-clamp-3 mt-1 font-normal">
                    {featured.overview}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-1.5">
                  <Link
                    to={`/movie/${featured.id}`}
                    className="btn-glow-purple px-4 py-2 rounded-lg text-xs font-semibold uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <EyeIcon className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel border border-brand-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 w-full max-w-2xl h-[260px] items-center justify-center">
              <span className="text-brand-gray/80 text-xs animate-pulse font-medium">Loading Spotlight Feature...</span>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section (Minimal Inline Style) */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 pb-10 w-full z-10">
        <div className="border-t border-b border-brand-border/40 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10K+', label: 'Movies Catalog' },
            { value: '50K+', label: 'Critic Ratings' },
            { value: '5K+', label: 'Active Watchlists' },
            { value: '100%', label: 'Free Platform' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center gap-0.5">
              <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{item.value}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gray/60">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 w-full">
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-3 mb-6">
          <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-brand-primary">
            Trending Movies
          </h2>
          <Link to="/movies" className="text-xs font-semibold text-brand-yellow hover:opacity-85 flex items-center gap-0.5 transition-opacity">
            <span>View All</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <Loader count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {trending.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Releases Preview Section */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 w-full">
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-3 mb-6">
          <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-brand-primary">
            Latest Releases
          </h2>
          <Link to="/movies" className="text-xs font-semibold text-brand-yellow hover:opacity-85 flex items-center gap-0.5 transition-opacity">
            <span>View All</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <Loader count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {latest.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>

      {/* Genres Preview Section */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 w-full mb-12">
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-3 mb-6">
          <h2 className="text-xs md:text-sm font-bold tracking-widest uppercase text-brand-primary">
            Explore by Genre
          </h2>
          <Link to="/genres" className="text-xs font-semibold text-brand-yellow hover:opacity-85 flex items-center gap-0.5 transition-opacity">
            <span>View All</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {homeGenres.map((genre) => (
            <Link
              key={genre.name}
              to={`/genres?genre=${genre.name}`}
              className="relative aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden group shadow-md border border-brand-border/40"
            >
              {/* Cover Photo */}
              <img
                src={genre.bg}
                alt={genre.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-500"
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${genre.gradient} opacity-90 transition-opacity`} />
              
              {/* Text */}
              <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
                <span className="text-sm sm:text-base font-extrabold text-white group-hover:text-brand-yellow tracking-tight transition-colors duration-200">
                  {genre.name}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-brand-gray/80 tracking-widest uppercase mt-0.5">
                  {genre.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
