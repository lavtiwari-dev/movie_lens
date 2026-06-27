import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onSelectMovie, sectionTitle, emptyMessage }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎬</div>
        <p className="empty-state-text">{emptyMessage || 'No movies found.'}</p>
      </div>
    );
  }

  return (
    <section className="movie-section">
      {sectionTitle && (
        <div className="section-header">
          <h2 className="section-title">{sectionTitle}</h2>
          <span className="section-count">{movies.length} titles</span>
        </div>
      )}
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelectMovie}
          />
        ))}
      </div>
    </section>
  );
}
