# Star Trails

Star Trails is a single-star travel archive. The planned MVP lets visitors explore places,
view them on a map, inspect place details, and save favorites locally in their browser.

## Project structure

- `frontend/` - Vue 3, TypeScript, Vite, Pinia, and Vue Router application
- `supabase/` - versioned database migrations and seed data (Phase 2)
- `PROJECT_SPEC.txt` - project requirements and phased implementation guidance

## Local development

Requirements: Node.js 22+ and npm.

```bash
cd frontend
npm install
npm run dev
```

The development server runs at `http://localhost:5173` by default.

## Environment variables

Copy `frontend/.env.example` to `frontend/.env.local` when Supabase integration is introduced.
Do not commit `.env.local` or expose a Supabase service-role key in the frontend.

## Current status

Phase 1 is complete: the application structure, router, Pinia registration, placeholder views,
and Supabase directory are scaffolded. Database, map, filters, favorites, detail behavior,
testing, and deployment are intentionally deferred to their later phases.
