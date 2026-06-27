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
    genre_ids: [],        // not available in search results
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

  return {
    results: (data.Search || []).map(normalizeSearchResult),
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

/**
 * "Featured" movies — curated popular IMDb IDs shown on the home page
 * when the user hasn't searched yet (replaces TMDB trending endpoint).
 * Fetch details for each; skips any that fail.
 */
const FEATURED_IDS = [
  'tt9362722', // Spider-Man: Across the Spider-Verse (2023)
  'tt1517268', // Barbie (2023)
  'tt15398776', // Oppenheimer (2023)
  'tt4154796', // Avengers: Endgame
  'tt0816692', // Interstellar
  'tt0468569', // The Dark Knight
  'tt6791350', // Guardians of the Galaxy Vol. 3
  'tt1745960', // Top Gun: Maverick
  'tt3581652', // Poor Things (2023)
  'tt5433140', // Fast X
  'tt10366460', // Dune: Part Two (2024)
  'tt0111161', // The Shawshank Redemption
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0167260', // The Return of the King
  'tt0133093', // The Matrix
  'tt0073486', // One Flew Over the Cuckoo's Nest
];

export const getFeaturedMovies = async () => {
  const results = await Promise.allSettled(
    FEATURED_IDS.map((id) => getMovieDetails(id))
  );
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
};

export default omdb;
