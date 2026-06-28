import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

export default function SearchResults() {
  const { searchQuery } = useApp();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Reset page on search term change
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setMovies([]);
      setTotalPages(1);
      setTotalCount(0);
      return;
    }

    const loadSearchResults = async () => {
      setLoading(true);
      try {
        const data = await searchMovies(searchQuery, { page: currentPage });
        setMovies(data.results);
        setTotalCount(data.totalResults);
        setTotalPages(Math.ceil(data.totalResults / 10)); // OMDb returns 10 per page
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [searchQuery, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex-1 w-full animate-fade-in">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Search Results
          </h1>
          {searchQuery && (
            <p className="text-brand-gray text-xs md:text-sm mt-1">
              Found {totalCount} {totalCount === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {/* Content Panel */}
        {searchQuery.trim().length < 2 ? (
          <div className="glass-panel border border-brand-border rounded-2xl py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-3">🔍</span>
            <h3 className="text-lg font-bold text-white mb-1">Start Searching</h3>
            <p className="text-brand-gray text-xs max-w-xs leading-relaxed">
              Type at least 2 characters in the search bar above to look up movies in the OMDb database.
            </p>
          </div>
        ) : loading ? (
          <Loader count={12} />
        ) : movies.length === 0 ? (
          <div className="glass-panel border border-brand-border rounded-2xl py-20 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-3">🎬</span>
            <h3 className="text-lg font-bold text-white mb-1">No movies found</h3>
            <p className="text-brand-gray text-xs max-w-xs leading-relaxed">
              We couldn't find any films matching &ldquo;{searchQuery}&rdquo;. Please check your spelling or try another term.
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
