# MovieFinder

MovieFinder is a responsive movie discovery application built with React and Vite. It uses the [OMDb API](https://www.omdbapi.com/) to load a curated set of featured films, search for movies by title, show detailed IMDb metadata, and maintain a browser-local watchlist.

The repository directory is named `MovieLens`, while the product name shown in the interface is **MovieFinder**.

## Features

- Curated home page with 16 popular and highly rated films
- Debounced title search backed by OMDb
- Optional release-year search filter
- Detailed movie modal with plot, rating, runtime, genres, director, cast, awards, certification, and box office data
- Add/remove watchlist controls on cards and in the details modal
- Persistent watchlist and theme preference through `localStorage`
- Light and dark themes
- Responsive grid, loading skeletons, poster fallbacks, and empty states
- Keyboard support for opening cards, clearing search with <kbd>Esc</kbd>, and closing the details modal with <kbd>Esc</kbd>

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | React 19, JSX |
| Build tooling | Vite 8 |
| Routing | React Router 7 |
| API client | Axios |
| Styling | Tailwind CSS 3, PostCSS, custom CSS variables |
| Icons | Heroicons |
| Linting | Oxlint |
| Movie data | OMDb API |

## Prerequisites

Before starting, install:

- [Node.js](https://nodejs.org/) `20.19+` or `22.12+` (the minimum versions required by Vite 8)
- npm (included with Node.js)
- A free or paid [OMDb API key](https://www.omdbapi.com/apikey.aspx)

## Getting Started

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd MovieLens
   ```

2. Install the locked dependencies:

   ```bash
   npm ci
   ```

3. Create a local environment file from the supplied template:

   ```bash
   cp .env.example .env
   ```

4. Add your OMDb API key to `.env`:

   ```dotenv
   VITE_OMDB_API_KEY=your_omdb_api_key_here
   VITE_OMDB_BASE_URL=https://www.omdbapi.com
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite, normally `http://localhost:5173`.

Vite reads environment variables when the server starts. Restart the development server after changing `.env`.

## Environment Variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_OMDB_API_KEY` | Yes | None | Authenticates browser requests to OMDb. |
| `VITE_OMDB_BASE_URL` | No | `https://www.omdbapi.com` | Overrides the OMDb endpoint, useful when routing requests through a compatible proxy. |

Only variables prefixed with `VITE_` are exposed to client-side code. Consequently, the OMDb key is included in the production JavaScript bundle and should not be treated as a secret. For tighter key control, route OMDb requests through a server-side API or edge function and restrict that endpoint appropriately.

The checked-in `.gitignore` excludes `.env`, `.env.local`, and environment-specific local files. Do not commit real credentials.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts Vite with hot module replacement. |
| `npm run build` | Creates an optimized production bundle in `dist/`. |
| `npm run preview` | Serves the production bundle locally for a final check. |
| `npm run lint` | Runs Oxlint against the project. |

A typical pre-commit check is:

```bash
npm run lint
npm run build
```

## How the Application Works

### Routes

| Route | Page | Behavior |
| --- | --- | --- |
| `/` | Home | Shows featured movies, search, filters, and movie details. |
| `/watchlist` | Watchlist | Shows the movies saved in the current browser. |

`BrowserRouter` provides client-side routing. A production host must serve `index.html` as a fallback for unknown paths so that opening `/watchlist` directly does not return a server 404.

### Data flow

1. `main.jsx` mounts the React application.
2. `App.jsx` wraps all routes in `AppProvider` and renders the shared navigation.
3. On the home page, `getFeaturedMovies()` requests full details for a fixed set of IMDb IDs.
4. Search input is trimmed and debounced for 350 ms. Queries shorter than two characters continue to show featured content.
5. `searchMovies()` calls OMDb's `s` endpoint with `type=movie`, the first result page, and an optional `y` value.
6. Selecting a card calls `getMovieDetails()` with its IMDb ID and requests the full plot.
7. The API module normalizes OMDb's capitalized fields into one consistent shape used by the components.
8. Theme and watchlist updates flow through React context and are synchronized to `localStorage`.

### OMDb requests

The application makes three kinds of requests:

```text
Featured: GET /?apikey=<key>&i=<imdb-id>&plot=full
Search:   GET /?apikey=<key>&s=<query>&type=movie&page=1[&y=<year>]
Details:  GET /?apikey=<key>&i=<imdb-id>&plot=full
```

Featured movies are fetched concurrently. Failed entries are skipped with `Promise.allSettled`, allowing the rest of the featured grid to render.

Search results contain only summary fields. Rating, plot, genres, cast, director, runtime, awards, and box office data become available after the detail request succeeds.

### Normalized movie model

Components consume normalized objects rather than raw OMDb responses. Important fields include:

| Field | Meaning |
| --- | --- |
| `id`, `imdbID` | IMDb title identifier used for keys, detail requests, and watchlist deduplication |
| `title` | Display title |
| `posterUrl` | Direct OMDb poster URL, or `null` when unavailable |
| `year`, `release_date` | Normalized release information |
| `vote_average` | Numeric IMDb rating, available in detail responses |
| `overview` | Full OMDb plot |
| `genres` | Array of `{ name }` objects |
| `runtime` | Runtime in minutes |
| `director`, `actors` | Credits shown in the modal |
| `rated`, `country`, `awards`, `boxOffice` | Additional detail metadata |

### Browser persistence

No account or backend database is used. Data is scoped to the current browser and origin.

| Storage key | Value |
| --- | --- |
| `mf-theme` | `dark` or `light` |
| `mf-watchlist` | JSON array of normalized movie objects |

Clearing site data, using another browser, or changing the deployment origin results in a separate watchlist. Corrupt watchlist JSON is safely treated as an empty list.

## Project Structure

```text
MovieLens/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── omdb.js             # Axios client, API functions, normalization
│   ├── assets/                 # Static source assets
│   ├── components/
│   │   ├── Filters.jsx         # Filter popover and controls
│   │   ├── Loader.jsx          # Movie-card skeleton grid
│   │   ├── MovieCard.jsx       # Poster card and watchlist controls
│   │   ├── MovieGrid.jsx       # Movie collection and empty state
│   │   ├── MovieModal.jsx      # Full OMDb details dialog
│   │   ├── Navbar.jsx          # Routes, watchlist count, theme toggle
│   │   └── SearchBar.jsx       # Debounced controlled search input
│   ├── context/
│   │   └── AppContext.jsx      # Shared theme, watchlist, search, filters
│   ├── pages/
│   │   ├── Home.jsx            # Discovery and search page
│   │   └── Watchlist.jsx       # Saved movies page
│   ├── App.jsx                 # Provider, router, and routes
│   ├── index.css               # Tailwind layers and application styles
│   └── main.jsx                # Browser entry point
├── .env.example
├── .oxlintrc.json
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Styling and Themes

Tailwind scans `index.html` and all source JavaScript/TypeScript files. Most application-specific rules live in `src/index.css`; Tailwind utility classes are used primarily for icon dimensions and a few layout details.

Theme colors are CSS custom properties. Dark mode is the default, and `AppProvider` adds or removes the `dark` class on `<html>`. The selected preference is restored from `mf-theme` on the next visit.

The Inter font is loaded from Google Fonts, while missing posters use a remote `placehold.co` image. Those resources may not render when the browser is offline or blocks third-party assets.

## Current Limitations

- OMDb search returns at most 10 titles per page; the UI currently requests only page 1 and has no pagination.
- Search uses OMDb's title-search parameter. Despite the broad input placeholder, director and genre searches are not supported by the API call.
- The genre and minimum-rating controls are present, but the current home-page selection logic does not apply them to rendered results. Search summaries also lack genre and rating fields, so supporting these filters requires fetching details for candidate titles or filtering a detail-rich data set.
- The year filter is sent to OMDb only when there is an active title query; selecting a year without a search does not request a year-wide listing.
- API failures are converted to empty result states in several components instead of displaying the underlying error or retry controls.
- The watchlist is local-only and is not synchronized between browsers or devices.
- There is currently no automated test suite.
- Featured loading can consume multiple OMDb requests on each home-page mount because all curated titles are fetched individually and no response cache is implemented.

## Production Build and Deployment

Create and test the production bundle locally:

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to any static host that supports SPA fallback routing, such as Netlify, Vercel, Cloudflare Pages, GitHub Pages with an appropriate fallback, or an Nginx/Apache server.

Configure `VITE_OMDB_API_KEY` in the hosting provider's build environment before running `npm run build`. Environment values are embedded at build time; changing them requires a new build.

For a subpath deployment such as `https://example.com/movie-finder/`, configure Vite's `base` option and ensure React Router receives compatible routing behavior.

## Troubleshooting

### Featured movies or searches are empty

- Confirm `VITE_OMDB_API_KEY` is set to an active key.
- Restart Vite after editing `.env`.
- Inspect the browser Network panel for OMDb responses such as `Invalid API key!` or request-limit errors.
- Verify that the browser can reach `https://www.omdbapi.com`.

### Search does not start immediately

This is expected: the input waits 350 ms after typing stops, and a query must contain at least two trimmed characters.

### A direct visit to `/watchlist` returns 404 after deployment

Configure the host to rewrite unknown requests to `/index.html`. Vite's local server already handles this during development.

### Posters show placeholders

OMDb sometimes returns no poster or an inaccessible remote image. `MovieCard` and `MovieModal` intentionally fall back to a placeholder in either case.

### The watchlist disappeared

The watchlist is stored only in browser `localStorage`. Check that you are using the same browser profile, protocol, hostname, and port, and that site data has not been cleared.

## Extending the Project

Good next additions include pagination, response caching, visible API error states, accessible focus trapping in the modal, detail-backed genre/rating filters, automated component tests, and optional account-based watchlist synchronization.

When adding shared state, expose it through `AppContext`. Keep raw OMDb field conversion inside `src/api/omdb.js` so UI components continue to receive a stable application model.

## License

No license file is currently included. Unless the repository owner adds one, the source code remains under the owner's default copyright rights.
