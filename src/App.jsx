import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Genres from './pages/Genres';
import SearchResults from './pages/SearchResults';
import Favorites from './pages/Favorites';
import MovieDetails from './pages/MovieDetails';
import About from './pages/About';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-root flex flex-col min-h-screen bg-brand-bg text-brand-primary overflow-x-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watchlist" element={<Favorites />} /> {/* Legacy compatibility */}
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
