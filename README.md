# MovieLens — Discover Movies & Ratings

MovieLens is a modern, premium, dark-themed movie discovery website built with React, Vite, and Tailwind CSS. Inspired by the aesthetics of Netflix, IMDb, and Letterboxd, the interface features glassmorphism panels, soft glowing borders, neon highlights, and premium micro-animations (card lifts, rating glows, and theme toggle rotations). It integrates with the live [OMDb API](https://www.omdbapi.com/) to offer comprehensive search, detailed reviews, charts, catalog paging, and a local favorites database.

## Features

- **Double-Column Hero Banner**: Split layout featuring a popular search tags row and a large glassmorphic Featured Movie card (e.g. *The Dark Knight*) with quick-view and trailer triggers.
- **Cinematic Visual Theme**: Pure CSS variable styling support for:
  - Dark background (`#070B14`) and card backdrops (`#101827`).
  - Glowing yellow accent highlights (`#FFC107`) and CTA buttons in purple (`#6C5CE7`).
  - Soft glowing hover behaviors, card lifts, and poster image zoom transitions.
  - A circular rotating Light/Dark mode switcher.
- **Multi-Filter Movies Page**: Search with dedicated dropdown filters for Genre, Year, IMDb score thresholds, and client-side sorting (IMDb score, release date, alphabetical).
- **IMDb Top Rated Page**: Ranked chart listing complete with ranking position badges (`#1`, `#2`) and a "Top 250" hover indicator.
- **Genres Catalog**: Beautiful visual cards for 10 cinematic genres, using responsive cover pictures and simulated movie count stats.
- **Dynamic Search Page**: Displays paginated matching grids or a clean "No movies found." vector empty state.
- **Favorites Page (Watchlist)**: Browser local-storage based personal list featuring custom sorting options (Recently Added, Highest Rated, Alphabetical) and quick delete shortcuts.
- **Movie Details Page**: Immersive profile page showing a blurred poster backdrop overlay, spec grids (director, cast, box office, awards, country, language), ratings metrics from IMDb, Rotten Tomatoes, and Metacritic, and a Related Movies Carousel based on primary genres.
- **About Page**: Mission details, technology logs, contact support mailers, and custom graphic blocks.

## Tech Stack

| Component | Technology |
| --- | --- |
| **Framework** | React 19 (Hooks, Context, JSX) |
| **Bundler & Tooling** | Vite 8 |
| **Navigation Routing** | React Router 7 |
| **API Requests** | Axios |
| **Styling Engine** | Tailwind CSS 3 & PostCSS |
| **Typography** | Poppins (via Google Fonts) |
| **Icon Libraries** | `@heroicons/react` |
| **Static Linter** | Oxlint |
| **Data Provider** | OMDb API |

## Prerequisites

Before building or running locally, make sure you have installed:

- [Node.js](https://nodejs.org/) `20.19+` or `22.12+` (Vite 8 requirement)
- npm (installed with Node.js)
- An [OMDb API key](https://www.omdbapi.com/apikey.aspx)

## Getting Started

1. Clone the repository and navigate to the folder:
   ```bash
   git clone <repository-url>
   cd MovieLens
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file to insert your API key:
   ```dotenv
   VITE_OMDB_API_KEY=976a7512
   VITE_OMDB_BASE_URL=https://www.omdbapi.com
   ```

5. Launch the local hot-rebuilding server:
   ```bash
   npm run dev
   ```

6. Open the Vite local server link in your browser, usually: `http://localhost:5173`.

---

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the local hot-reload dev server. |
| `npm run build` | Builds optimized production assets in `dist/`. |
| `npm run preview` | Runs a local server to test production builds. |
| `npm run lint` | Runs static analysis and linter rules (Oxlint). |

---

## Project Structure

```text
MovieLens/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── omdb.js             # Axios client, normalized models, batch loaders
│   ├── assets/                 # Vector resources
│   ├── components/
│   │   ├── Footer.jsx          # 4-column footer
│   │   ├── Loader.jsx          # Skeleton animation layout
│   │   ├── MovieCard.jsx       # Custom card with lifts, glows, and badges
│   │   ├── Navbar.jsx          # Sticky glassmorphic navbar with mobile drawer
│   │   └── TrailerModal.jsx    # Cinema-iframe trailer player modal
│   ├── context/
│   │   └── AppContext.jsx      # Theme, Favorites, and Search state providers
│   ├── pages/
│   │   ├── About.jsx           # Mission statement and contacts page
│   │   ├── Favorites.jsx       # Saved bookmarks page with sorting filters
│   │   ├── Genres.jsx          # Category grid cards page
│   │   ├── Home.jsx            # Split Hero, trending and latest previews page
│   │   ├── MovieDetails.jsx    # Complete reviews, details, and related carousel
│   │   ├── Movies.jsx          # Catalog grids with pagination
│   │   ├── SearchResults.jsx   # Paginated search matches page
│   │   └── TopRated.jsx        # Ranked chart indices page
│   ├── App.jsx                 # Routes map and provider wrapper
│   ├── index.css               # Google Font loading, variable themes, and animations
│   └── main.jsx                # Browser mounting point
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## Local Storage Mappings

Local storage is utilized to save client configuration preferences:

| Key | Format | Purpose |
| --- | --- | --- |
| `mf-theme` | `dark` / `light` | Saves selection for theme toggling. |
| `mf-watchlist` | JSON Array | Saves favorite bookmarked movie structures. |
