import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

const currentYear = new Date().getFullYear();
const yearsList = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, setSearchQuery } = useApp();

  // Local Filter States
  const [inputQuery, setInputQuery] = useState(searchParams.get('q') || searchQuery || 'Star');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating-desc');

  // Pagination & Fetch States
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize URL parameters if they change (e.g. from genre links)
  useEffect(() => {
    const urlGenre = searchParams.get('genre');
    if (urlGenre) {
      setSelectedGenre(urlGenre);
    }
    const urlSearch = searchParams.get('q');
    if (urlSearch) {
      setInputQuery(urlSearch);
      setSearchQuery(urlSearch);
    }
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const queryTerm = inputQuery.trim() || 'Star';
        const res = await searchMovies(queryTerm, { year: selectedYear, page: currentPage });
        
        if (res.results.length === 0) {
          setMovies([]);
          setTotalPages(1);
          return;
        }

        setMovies(res.results);
        setTotalPages(Math.ceil(res.totalResults / 10)); // OMDb returns 10 per page
      } catch (err) {
        setErrorMsg('Something went wrong fetching movies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [inputQuery, selectedYear, currentPage]);

  // Apply Genre, Rating Filter & Sorting on client-side on retrieved detailed items
  const getProcessedMovies = () => {
    let list = [...movies];

    // Filter by Genre
    if (selectedGenre) {
      list = list.filter((m) =>
        m.genres?.some((g) => g.name.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Filter by Min Rating
    if (selectedRating) {
      const minRatingValue = parseFloat(selectedRating);
      list = list.filter((m) => m.vote_average !== null && m.vote_average >= minRatingValue);
    }

    // Sorting options
    if (selectedSort === 'rating-desc') {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (selectedSort === 'date-desc') {
      list.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (selectedSort === 'date-asc') {
      list.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    } else if (selectedSort === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  };

  const processedMovies = getProcessedMovies();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams({ q: inputQuery });
    setSearchQuery(inputQuery);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex-1 w-full">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Catalog</h1>
          <p className="text-brand-gray text-xs md:text-sm mt-1">Explore titles dynamically. Powered by live OMDb results.</p>
        </div>

        {/* Filter Toolbar Panel */}
        <section className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end bg-brand-card/30 border border-brand-border rounded-2xl p-4">
            
            {/* Search Input */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray/80">Search Title</label>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full h-10 bg-brand-bg border border-brand-border rounded-lg px-3.5 text-xs text-brand-primary focus:outline-none focus:border-brand-yellow/50 transition-all"
              />
            </div>

            {/* Dropdowns Container */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-auto">
              
              {/* Genre Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray/80">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    setSearchParams(e.target.value ? { genre: e.target.value } : {});
                  }}
                  className="dropdown-filter-select h-10 text-xs"
                >
                  <option value="">All Genres</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray/80">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="dropdown-filter-select h-10 text-xs"
                >
                  <option value="">Any Year</option>
                  {yearsList.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray/80">Min Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="dropdown-filter-select h-10 text-xs"
                >
                  <option value="">Any Rating</option>
                  <option value="8.5">8.5+ Excellent</option>
                  <option value="8.0">8.0+ Superb</option>
                  <option value="7.5">7.5+ Great</option>
                  <option value="7.0">7.0+ Good</option>
                  <option value="6.0">6.0+ Above Avg</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray/80">Sort By</label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="dropdown-filter-select h-10 text-xs"
                >
                  <option value="rating-desc">Rating: High-Low</option>
                  <option value="date-desc">Year: New-Old</option>
                  <option value="date-asc">Year: Old-New</option>
                  <option value="title-asc">Title: A-Z</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="hidden" />
          </form>
        </section>

        {/* Content Section */}
        {loading ? (
          <Loader count={12} />
        ) : errorMsg ? (
          <div className="text-center py-20">
            <span className="text-red-500 text-sm font-medium">{errorMsg}</span>
          </div>
        ) : processedMovies.length === 0 ? (
          <div className="glass-panel border border-brand-border rounded-2xl py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-3">🎬</span>
            <h3 className="text-lg font-bold text-brand-primary mb-1">No movies found</h3>
            <p className="text-brand-gray text-xs max-w-xs leading-relaxed">
              We couldn't find any results matching your search terms and filters. Try tweaking your selection.
            </p>
          </div>
        ) : (
          <div>
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 animate-fade-in">
              {processedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4.5 py-2 border border-brand-border rounded-lg text-xs font-semibold text-brand-primary bg-brand-card/50 hover:bg-brand-yellow hover:text-black disabled:opacity-30 disabled:hover:bg-brand-card/50 disabled:hover:text-brand-primary cursor-pointer transition-colors"
                >
                  Previous
                </button>
                
                {/* Numbers */}
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

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4.5 py-2 border border-brand-border rounded-lg text-xs font-semibold text-brand-primary bg-brand-card/50 hover:bg-brand-yellow hover:text-black disabled:opacity-30 disabled:hover:bg-brand-card/50 disabled:hover:text-brand-primary cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
