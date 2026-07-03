import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

export default function Genres() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGenre = searchParams.get('genre') || '';

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const genresList = [
    {
      name: 'Action',
      count: '1,187 Movies',
      gradient: 'from-red-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Comedy',
      count: '1,625 Movies',
      gradient: 'from-amber-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Adventure',
      count: '1,541 Movies',
      gradient: 'from-emerald-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sci-Fi',
      count: '81 Movies',
      gradient: 'from-blue-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Animation',
      count: '384 Movies',
      gradient: 'from-pink-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Drama',
      count: '526 Movies',
      gradient: 'from-teal-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Thriller',
      count: '188 Movies',
      gradient: 'from-orange-950/65 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Crime',
      count: '1,326 Movies',
      gradient: 'from-neutral-900/70 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1525824236856-8d0431def3ab?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fantasy',
      count: '531 Movies',
      gradient: 'from-indigo-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Horror',
      count: '1,381 Movies',
      gradient: 'from-purple-950/70 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
    },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre]);

  useEffect(() => {
    if (!selectedGenre) return;

    const fetchGenreMovies = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await searchMovies(selectedGenre, { page: currentPage });
        if (res.results.length === 0) {
          setMovies([]);
          setTotalPages(1);
          return;
        }
        setMovies(res.results);
        setTotalPages(Math.ceil(res.totalResults / 10));
      } catch (err) {
        setErrorMsg('Failed to load movies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreMovies();
  }, [selectedGenre, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToGenres = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex-1 w-full animate-fade-in">
        {selectedGenre ? (
          <div>
            {/* Header Block with Back Button */}
            <div className="flex flex-col gap-4 border-b border-brand-border/40 pb-6 mb-8">
              <button
                onClick={handleBackToGenres}
                className="flex items-center gap-1.5 bg-black/60 border border-brand-border px-3.5 py-2 rounded-full text-[10px] font-bold text-white tracking-widest uppercase backdrop-blur hover:border-brand-yellow hover:text-brand-yellow transition-all w-fit cursor-pointer"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>All Genres</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white capitalize">
                  {selectedGenre} Movies
                </h1>
                <p className="text-brand-gray text-xs md:text-sm mt-1">
                  Showing dynamic search results for {selectedGenre} movies.
                </p>
              </div>
            </div>

            {/* Content list */}
            {loading ? (
              <Loader count={12} />
            ) : errorMsg ? (
              <div className="text-center py-20">
                <span className="text-red-500 text-sm font-medium">{errorMsg}</span>
              </div>
            ) : movies.length === 0 ? (
              <div className="glass-panel border border-brand-border rounded-2xl py-20 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-3">🎬</span>
                <h3 className="text-lg font-bold text-white mb-1">No movies found</h3>
                <p className="text-brand-gray text-xs max-w-xs leading-relaxed">
                  We couldn't find any results matching this genre.
                </p>
              </div>
            ) : (
              <div>
                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 w-full">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-brand-border rounded-lg text-xs font-semibold text-brand-primary bg-brand-card/50 hover:bg-brand-yellow hover:text-black disabled:opacity-30 disabled:hover:bg-brand-card/50 disabled:hover:text-brand-primary cursor-pointer transition-colors"
                    >
                      Previous
                    </button>
                    
                    {/* Mobile Page indicator */}
                    <span className="sm:hidden text-xs text-brand-gray font-medium px-2">
                      {currentPage} / {totalPages}
                    </span>

                    {/* Numbers for desktop */}
                    <div className="hidden sm:flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                        let pageNum = currentPage;
                        if (currentPage <= 3) {
                          pageNum = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + idx;
                        } else {
                          pageNum = currentPage - 2 + idx;
                        }
                        if (pageNum < 1 || pageNum > totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 border rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer transition-all ${
                              currentPage === pageNum
                                ? 'border-brand-yellow text-black bg-brand-yellow font-bold shadow-md'
                                : 'border-brand-border text-brand-primary bg-brand-card/50 hover:bg-brand-card'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-brand-border rounded-lg text-xs font-semibold text-brand-primary bg-brand-card/50 hover:bg-brand-yellow hover:text-black disabled:opacity-30 disabled:hover:bg-brand-card/50 disabled:hover:text-brand-primary cursor-pointer transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Header Title */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Genres</h1>
              <p className="text-brand-gray text-xs md:text-sm mt-1">
                Browse through curated catalogs grouped by cinematic style.
              </p>
            </div>

            {/* Genres Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {genresList.map((g) => (
                <Link
                  key={g.name}
                  to={`/genres?genre=${g.name}`}
                  className="relative aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden group shadow-md border border-brand-border/40 transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Cover Photo */}
                  <img
                    src={g.image}
                    alt={g.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-500"
                  />
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${g.gradient} opacity-90 transition-opacity`} />

                  {/* Title & Info */}
                  <div className="absolute inset-0 p-3 sm:p-4.5 flex flex-col justify-end">
                    <span className="text-sm sm:text-lg lg:text-xl font-extrabold text-white group-hover:text-brand-yellow tracking-tight transition-colors duration-200">
                      {g.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-brand-gray tracking-widest uppercase mt-0.5">
                      {g.count}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
