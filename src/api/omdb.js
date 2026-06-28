import axios from 'axios';

const BASE_URL = import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const omdb = axios.create({
  baseURL: BASE_URL,
  params: { apikey: API_KEY },
});

// ── OMDb response field → normalized app shape ─────────────────────────────

/**
 * Normalize a search-result item (from ?s= endpoint).
 * Note: search results don't include rating or overview — those only come from ?i=
 */
export function normalizeSearchResult(raw) {
  return {
    id: raw.imdbID,
    imdbID: raw.imdbID,
    title: raw.Title || '',
    posterUrl: raw.Poster && raw.Poster !== 'N/A' ? raw.Poster : null,
    release_date: raw.Year ? `${raw.Year.slice(0, 4)}-01-01` : '',
    year: raw.Year ? raw.Year.slice(0, 4) : '—',
    vote_average: null,   // not available in search results
    overview: '',
    genres: [],
    type: raw.Type || 'movie',
  };
}

/**
 * Normalize a full detail response (from ?i= endpoint).
 * Merges all rich fields and preserves the same shape as normalizeSearchResult.
 */
export function normalizeDetail(raw) {
  const ratingStr = raw.imdbRating && raw.imdbRating !== 'N/A' ? raw.imdbRating : null;
  const runtimeMin =
    raw.Runtime && raw.Runtime !== 'N/A'
      ? parseInt(raw.Runtime, 10) || null
      : null;

  const genreList =
    raw.Genre && raw.Genre !== 'N/A'
      ? raw.Genre.split(',').map((g) => ({ name: g.trim() }))
      : [];

  const actorsList =
    raw.Actors && raw.Actors !== 'N/A'
      ? raw.Actors.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

  return {
    id: raw.imdbID,
    imdbID: raw.imdbID,
    title: raw.Title || '',
    posterUrl: raw.Poster && raw.Poster !== 'N/A' ? raw.Poster : null,
    backdropUrl: null,  // OMDb free tier has no backdrop images
    release_date: raw.Released && raw.Released !== 'N/A' ? raw.Released : (raw.Year || ''),
    year: raw.Year ? raw.Year.slice(0, 4) : '—',
    vote_average: ratingStr ? parseFloat(ratingStr) : null,
    overview: raw.Plot && raw.Plot !== 'N/A' ? raw.Plot : '',
    tagline: '',
    genres: genreList,
    runtime: runtimeMin,
    director: raw.Director && raw.Director !== 'N/A' ? raw.Director : '',
    actors: actorsList,
    rated: raw.Rated && raw.Rated !== 'N/A' ? raw.Rated : '',
    country: raw.Country && raw.Country !== 'N/A' ? raw.Country : '',
    awards: raw.Awards && raw.Awards !== 'N/A' ? raw.Awards : '',
    boxOffice: raw.BoxOffice && raw.BoxOffice !== 'N/A' ? raw.BoxOffice : '',
    
    // Premium Extended Metadata Fields
    writer: raw.Writer && raw.Writer !== 'N/A' ? raw.Writer : '',
    language: raw.Language && raw.Language !== 'N/A' ? raw.Language : '',
    production: raw.Production && raw.Production !== 'N/A' ? raw.Production : '',
    imdbVotes: raw.imdbVotes && raw.imdbVotes !== 'N/A' ? raw.imdbVotes : '0',
    ratings: raw.Ratings || [],
    type: raw.Type || 'movie',
  };
}

// ── API functions ──────────────────────────────────────────────────────────

/**
 * Search movies by query string.
 * Supports optional year filter via OMDb's `y` param.
 * Returns { results: NormalizedMovie[], totalResults: number }
 */
export const searchMovies = async (query, { year = '', page = 1 } = {}) => {
  const params = { s: query, type: 'movie', page };
  if (year) params.y = year;

  const res = await omdb.get('/', { params });
  const data = res.data;

  if (data.Response === 'False') {
    return { results: [], totalResults: 0 };
  }

  // To make the search results list look premium (which requires IMDb ratings), 
  // we can fetch details for each search result item in parallel.
  // Note: Since this is 10 requests per page, it's efficient enough for typical rates.
  const searchItems = data.Search || [];
  const detailedResults = await Promise.allSettled(
    searchItems.map((item) => getMovieDetails(item.imdbID))
  );

  const results = detailedResults
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);

  return {
    results: results.length > 0 ? results : searchItems.map(normalizeSearchResult),
    totalResults: parseInt(data.totalResults, 10) || 0,
  };
};

/**
 * Get full movie details by IMDb ID.
 * Returns a NormalizedDetail object.
 */
export const getMovieDetails = async (imdbID) => {
  const res = await omdb.get('/', { params: { i: imdbID, plot: 'full' } });
  if (res.data.Response === 'False') throw new Error(res.data.Error || 'Not found');
  return normalizeDetail(res.data);
};

// Curated lists for specialized landing and preview rows
const FEATURED_IDS = [
  'tt0468569', // The Dark Knight (Featured Hero Card)
  'tt9362722', // Spider-Man: Across the Spider-Verse
  'tt1517268', // Barbie
  'tt15398776', // Oppenheimer
  'tt4154796', // Avengers: Endgame
  'tt0816692', // Interstellar
  'tt10366460', // Dune: Part Two
  'tt6791350', // Guardians of the Galaxy Vol. 3
  'tt1745960', // Top Gun: Maverick
  'tt3581652', // Poor Things
  'tt5433140', // Fast X
  'tt0111161', // The Shawshank Redemption
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0167260', // The Return of the King
  'tt0133093', // The Matrix
  'tt0073486', // One Flew Over the Cuckoo's Nest
];

const TRENDING_IDS = [
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt4154796', // Avengers: Endgame
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt0111161', // The Shawshank Redemption
  'tt0137523', // Fight Club
];

const LATEST_RELEASE_IDS = [
  'tt10366460', // Dune: Part Two
  'tt6263850',  // Deadpool & Wolverine
  'tt17279496', // Civil War
  'tt22022452', // Inside Out 2
  'tt12037194', // Furiosa: A Mad Max Saga
  'tt16428732', // Challengers
];

// Utility batch fetching
export const getMoviesByIds = async (ids) => {
  const results = await Promise.allSettled(
    ids.map((id) => getMovieDetails(id))
  );
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
};

export const getFeaturedMovies = () => getMoviesByIds(FEATURED_IDS);
export const getTrendingMovies = () => getMoviesByIds(TRENDING_IDS);
export const getLatestReleases = () => getMoviesByIds(LATEST_RELEASE_IDS);

export default omdb;
