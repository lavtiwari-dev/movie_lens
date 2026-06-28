import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Genres() {
  const genresList = [
    {
      name: 'Action',
      count: '1,248 Movies',
      gradient: 'from-red-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Comedy',
      count: '984 Movies',
      gradient: 'from-amber-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Adventure',
      count: '852 Movies',
      gradient: 'from-emerald-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sci-Fi',
      count: '741 Movies',
      gradient: 'from-blue-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Animation',
      count: '624 Movies',
      gradient: 'from-pink-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Drama',
      count: '1,532 Movies',
      gradient: 'from-teal-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Thriller',
      count: '542 Movies',
      gradient: 'from-orange-950/65 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Crime',
      count: '439 Movies',
      gradient: 'from-neutral-900/70 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1525824236856-8d0431def3ab?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fantasy',
      count: '312 Movies',
      gradient: 'from-indigo-950/60 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Horror',
      count: '450 Movies',
      gradient: 'from-purple-950/70 via-neutral-950/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 flex-1 w-full animate-fade-in">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Genres</h1>
          <p className="text-brand-gray text-xs md:text-sm mt-1">
            Browse through curated catalogs grouped by cinematic style.
          </p>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {genresList.map((g) => (
            <Link
              key={g.name}
              to={`/movies?genre=${g.name}`}
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
              <div className="absolute inset-0 p-4.5 flex flex-col justify-end">
                <span className="text-[18px] sm:text-[20px] font-extrabold text-white group-hover:text-brand-yellow tracking-tight transition-colors duration-200">
                  {g.name}
                </span>
                <span className="text-[9px] font-bold text-brand-gray tracking-widest uppercase mt-0.5">
                  {g.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
