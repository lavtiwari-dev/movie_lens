export default function Loader({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
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
