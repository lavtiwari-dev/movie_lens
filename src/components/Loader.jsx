export default function Loader({ count = 12 }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-poster" />
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line-lg" />
            <div className="skeleton-line skeleton-line-sm" />
            <div className="skeleton-line skeleton-line-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
