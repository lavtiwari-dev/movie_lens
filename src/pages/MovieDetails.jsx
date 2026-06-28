import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, BookmarkIcon, BookmarkSlashIcon, ShareIcon, ArrowLeftIcon, CalendarIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import { getMovieDetails, searchMovies } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';

const FALLBACK_POSTER = 'https://placehold.co/300x450/111115/ffffff?text=No+Poster';

export default function MovieDetails() {
  const { id } = useParams();
  const { isInFavorites, addToFavorites, removeFromFavorites } = useApp();

  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shareSuccess, setShareSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const details = await getMovieDetails(id);
        setMovie(details);

        // Fetch related movies based on the first genre
        if (details.genres && details.genres.length > 0) {
          const primaryGenre = details.genres[0].name;
          const searchRes = await searchMovies(primaryGenre);
          const filtered = searchRes.results
            .filter((m) => m.id !== id)
            .slice(0, 6);
          setRelated(filtered);
        }
      } catch (err) {
        console.error('Failed to load movie details page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
          <span className="text-brand-gray text-xs animate-pulse font-medium">Loading presentation...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Movie Not Found</h2>
          <p className="text-brand-gray text-xs mb-6">The requested movie could not be loaded from OMDb.</p>
          <Link to="/" className="btn-glow-purple px-5 py-2.5 rounded-lg text-xs font-semibold text-white uppercase">
            Go back Home
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = isInFavorites(movie.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const posterUrl = movie.posterUrl && !imgError ? movie.posterUrl : FALLBACK_POSTER;

  // Rating values lookup
  const getRatingValue = (source) => {
    const found = movie.ratings?.find((r) => r.Source === source);
    return found ? found.Value : null;
  };

  const formatRuntime = (mins) => {
    if (!mins) return '—';
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-brand-bg">
      {/* Banner / Hero Section with Blurred Poster Backdrop */}
      <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden">
        {/* Background Image Blurred */}
        <div className="absolute inset-0 z-0">
          <img
            src={posterUrl}
            alt=""
            className="w-full h-full object-cover blur-[50px] scale-110 opacity-20 select-none"
          />
          {/* Radial mask and dark linear overlay */}
          <div className="banner-overlay absolute inset-0 z-10" />
        </div>

        {/* Back navigation */}
        <div className="absolute top-5 left-4 md:left-8 z-30">
          <Link
            to={-1}
            className="flex items-center gap-1.5 bg-black/60 border border-brand-border px-3.5 py-2 rounded-full text-[10px] font-bold text-white tracking-widest uppercase backdrop-blur hover:border-brand-yellow hover:text-brand-yellow transition-all"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </Link>
        </div>
      </section>

      {/* Main Details Container */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 z-20 -mt-[180px] md:-mt-[220px] pb-16 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Poster & Buttons */}
          <div className="w-48 sm:w-60 md:w-72 shrink-0 mx-auto lg:mx-0 flex flex-col gap-4">
            <div className="w-full aspect-[2/3] rounded-xl overflow-hidden shadow-xl border border-brand-border bg-brand-card">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover animate-fade-in"
                onError={() => setImgError(true)}
              />
            </div>

            {/* Bookmark & Share Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleFavoriteToggle}
                className={`py-2.5 rounded-lg font-semibold text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                    : 'bg-brand-card border-brand-border text-white hover:border-brand-yellow hover:text-brand-yellow'
                }`}
              >
                {isFavorite ? <BookmarkSlashIcon className="w-3.5 h-3.5" /> : <BookmarkIcon className="w-3.5 h-3.5" />}
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShareClick}
                className="py-2.5 rounded-lg bg-brand-card border border-brand-border text-white hover:border-brand-yellow hover:text-brand-yellow font-semibold text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all relative"
              >
                <ShareIcon className="w-3.5 h-3.5" />
                <span>{shareSuccess ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Metadata info */}
          <div className="flex-1 flex flex-col gap-5 w-full text-brand-primary">
            <div className="flex flex-col gap-1.5">
              <span className="text-brand-yellow font-bold text-[10px] uppercase tracking-widest bg-brand-yellow/5 border border-brand-yellow/10 px-3 py-1 rounded-full w-fit">
                {movie.type}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1">{movie.title}</h1>
              
              {/* Short Metadata list */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs font-semibold text-brand-gray mt-1.5">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-brand-yellow" />
                  {movie.year}
                </span>
                <span className="text-brand-muted">•</span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 text-brand-yellow" />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="text-brand-muted">•</span>
                <span className="border border-white/10 px-1.5 py-0.5 rounded-[3px] text-[9px] uppercase font-bold text-brand-primary bg-white/5">{movie.rated || 'NR'}</span>
                <span className="text-brand-muted">•</span>
                <span>{movie.language}</span>
              </div>
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => (
                <span key={g.name} className="text-[11px] font-semibold text-brand-yellow bg-brand-yellow/5 border border-brand-yellow/10 px-3 py-1 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Ratings Summary Metrics (Minimal Typography) */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-brand-border/40 py-5 my-1">
              {/* IMDb Rating */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-brand-gray uppercase tracking-widest">IMDb Score</span>
                <span className="text-lg md:text-2xl font-black text-white mt-0.5">
                  {movie.vote_average ? `${movie.vote_average}` : 'N/A'}<span className="text-xs text-brand-gray font-normal">/10</span>
                </span>
                <span className="text-[9px] text-brand-muted mt-0.5 font-medium">{movie.imdbVotes} votes</span>
              </div>

              {/* Rotten Tomatoes */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-brand-gray uppercase tracking-widest">Tomatometer</span>
                <span className="text-lg md:text-2xl font-black text-white mt-0.5">
                  {getRatingValue('Rotten Tomatoes') || 'N/A'}
                </span>
                <span className="text-[9px] text-brand-muted mt-0.5 font-medium">Rotten Tomatoes</span>
              </div>

              {/* Metacritic */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-brand-gray uppercase tracking-widest">Metascore</span>
                <span className="text-lg md:text-2xl font-black text-white mt-0.5">
                  {getRatingValue('Metacritic') || 'N/A'}
                </span>
                <span className="text-[9px] text-brand-muted mt-0.5 font-medium">Metacritic Score</span>
              </div>
            </div>

            {/* Plot/Overview Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray">Plot Summary</h3>
              <p className="text-brand-gray text-[13px] leading-relaxed font-normal">
                {movie.overview || 'No description plot available from OMDb.'}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="border border-brand-border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-[11px] font-semibold text-brand-gray bg-brand-card/30">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-muted">Director</span>
                <span className="text-brand-primary text-right font-normal">{movie.director}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-muted">Writer</span>
                <span className="text-brand-primary text-right font-normal">{movie.writer}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-muted">Box Office</span>
                <span className="text-brand-yellow font-semibold text-right">{movie.boxOffice || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-brand-muted">Awards</span>
                <span className="text-brand-primary text-right font-normal">{movie.awards || 'None'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5 md:border-none md:pb-0">
                <span className="text-brand-muted">Country</span>
                <span className="text-brand-primary text-right font-normal">{movie.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Production</span>
                <span className="text-brand-primary text-right font-normal">{movie.production || 'N/A'}</span>
              </div>
            </div>

            {/* Cast section */}
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray">Principal Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.actors.map((actor) => (
                  <span key={actor} className="px-3 py-1.5 border border-brand-border rounded-lg bg-brand-card/50 text-[11px] font-medium text-brand-primary hover:border-brand-yellow transition-all">
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 hover:border-brand-yellow hover:text-brand-yellow bg-white/5 px-4.5 py-2 rounded-lg text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                <span>IMDb Profile</span>
              </a>
            </div>

          </div>
        </div>

        {/* Related Movies List */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="border-b border-brand-border/40 pb-3 mb-6">
              <h3 className="text-xs font-bold tracking-widest uppercase text-brand-primary">Related Movies</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {related.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
