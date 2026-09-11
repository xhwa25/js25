# Star Trails

Star Trails is a responsive travel archive for browsing places through photography, searchable location data, and an interactive world map. The project pairs a Vue 3 and TypeScript frontend with Supabase-backed place data and visitor notes, plus a Mapbox GL JS 3D globe for geographic exploration.

## Live Demo

[View Star Trails on Azure Static Web Apps](https://agreeable-field-0aa2edc10.3.azurestaticapps.net/)

## Key Features

- Browse a responsive archive of place cards with optimized, lazy-loaded images
- Search by place name, city, or country
- Combine category, country, city, and visit-year filters
- Explore locations as category-colored markers on an interactive Mapbox 3D globe
- Open dedicated place pages with details, a 2D Mapbox map, and Google Maps links when available
- Save favorite places locally without creating an account
- Post anonymous visitor notes backed by Supabase
- Switch interface text between English and Chinese while preserving stored place content

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Vite
- **State and routing:** Pinia, Vue Router
- **Data:** Supabase JavaScript client, PostgreSQL, Row Level Security
- **Maps:** Mapbox GL JS with globe and Mercator projections
- **Styling:** Custom responsive CSS
- **Deployment:** Azure Static Web Apps through GitHub Actions

## Architecture

The Vue application is organized around route-level views and reusable UI components. Pinia stores manage shared place filters, favorites, and language state. Components do not query Supabase directly; database access is isolated in service modules for places and visitor notes. Mapbox configuration is shared between the globe and place-detail maps, while non-initial routes are lazy-loaded to keep the Explore page bundle smaller.

```text
js25/
├── frontend/
│   └── src/
│       ├── components/   # Cards, filters, maps, navigation, and notes
│       ├── router/       # Application routes and lazy-loaded views
│       ├── services/     # Supabase queries and shared Mapbox configuration
│       ├── stores/       # Places, favorites, and language state
│       ├── types/        # Shared TypeScript models
│       └── views/        # Explore, map, saved, and place-detail pages
├── supabase/
│   ├── migrations/       # Places, indexes, RLS policies, and comments
│   └── seed.sql          # Development sample data
└── .github/workflows/    # Azure Static Web Apps deployment
```

## Screenshots

UI screenshots are not currently committed to the repository. Open the [live application](https://agreeable-field-0aa2edc10.3.azurestaticapps.net/) to explore the Locations, 3D Globe, and Saved Places views.

## Local Setup

Prerequisites: a current Node.js release, npm, a Supabase project, and a Mapbox access token.

```bash
git clone git@github.com:leshiz-spec/js25.git
cd js25/frontend
npm install
cp .env.example .env.local
```

Add the following values to `frontend/.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

Apply the SQL files in `supabase/migrations/` to your Supabase project in numeric order. For local sample content, run `supabase/seed.sql` after the migrations.

Start the development server:

```bash
npm run dev
```

Create and preview a production build with:

```bash
npm run build
npm run preview
```

## Deployment

The project is deployed to Azure Static Web Apps. Pushes to `main` trigger the workflow in `.github/workflows/azure-static-web-apps-agreeable-field-0aa2edc10.yml`, which builds `frontend/` and publishes `frontend/dist/`.

The Azure deployment requires these GitHub Actions secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_AGREEABLE_FIELD_0AA2EDC10`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MAPBOX_ACCESS_TOKEN`
