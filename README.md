# X-Gene Detector

Full-stack application that analyzes DNA sequences to detect mutant gene patterns. Built with React 19, Express 5, and Supabase.

## Architecture

```
┌─────────────────┐       ┌─────────────────────┐       ┌──────────────┐
│                  │       │                      │       │              │
│  React Frontend  │──────▶│  Express REST API    │──────▶│   Supabase   │
│  (Vite + TW)     │ HTTP  │  (Node.js + TS)      │  SQL  │  (PostgreSQL)│
│                  │◀──────│                      │◀──────│              │
└─────────────────┘       └─────────────────────┘       └──────────────┘
```

**Backend layers:** `route → controller → service → repository`

- **Routes** — pure wiring, zero logic
- **Controllers** — HTTP concerns (validation, status codes, hashing)
- **Services** — business logic, fully testable without I/O
- **Repositories** — database operations isolated behind an interface

**Frontend architecture:** feature-based with co-located hooks, services, and presentational components.

## Algorithm

The detector uses **position-first traversal** across 4 directions (horizontal, vertical, both diagonals).

A DNA is classified as **mutant** if 2 or more sequences of 4 identical bases are found.

Key design choices:
- **O(N²) time and space** — single pass over the grid, constant work per cell
- **Early termination** — returns immediately upon finding 2 sequences
- **Position-first** — at each cell, all 4 directions are checked before moving on, avoiding directional bias that would consume cells needed by later directions
- **Cache-before-compute** — duplicate DNA submissions return the cached result from the database without re-running the algorithm

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- A [Supabase](https://supabase.com) project

### Setup

```bash
git clone <repo-url> && cd project-x-gene-detector
npm install
```

### Database

Create a `dna_records` table in your Supabase project:

```sql
create table dna_records (
  id         uuid primary key default gen_random_uuid(),
  dna_hash   text unique not null,
  dna_sequence text[] not null,
  is_mutant  boolean not null,
  created_at timestamptz default now()
);

create index idx_dna_records_is_mutant on dna_records (is_mutant);
```

### Environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in your Supabase credentials in `backend/.env`:

```
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
CORS_ORIGINS=
```

### Run

```bash
npm run dev          # starts both frontend and backend
npm run dev:backend  # backend only (port 3001)
npm run dev:frontend # frontend only (port 5173)
```

### Build

```bash
npm run build        # builds the frontend for production
```

## API

### `POST /mutant/`

Analyzes a DNA sequence. Returns **200** for mutant, **403** for human.

```json
// Request
{
  "dna": ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
}

// Response (200 — mutant)
{
  "is_mutant": true,
  "sequences": [[[4,0],[4,1],[4,2],[4,3]], [[0,4],[1,4],[2,4],[3,4]]]
}

// Response (403 — human)
{
  "is_mutant": false,
  "sequences": []
}
```

**Validation:**
- Only `A`, `T`, `C`, `G` characters allowed
- Matrix must be square (NxN), min 4x4, max 1000x1000
- Body size limited to 1MB

### `GET /stats/`

Returns aggregated analysis statistics.

```json
{
  "count_mutant_dna": 40,
  "count_human_dna": 100,
  "ratio": 0.4
}
```

### `GET /health`

Returns database connectivity status.

## Testing

```bash
npm test              # runs all unit tests (30 tests)
npm run test:coverage # coverage report (>80%)
```

Integration tests (require a test Supabase instance):

```bash
cp backend/.env.test.example backend/.env.test
# Fill in test DB credentials
npm run test:integration --workspace=backend
```

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Frontend | React 19, Vite 7, Tailwind CSS v4, Framer Motion   |
| Backend  | Express 5, TypeScript 5.9, Zod, Pino, Helmet       |
| Database | Supabase (PostgreSQL) with upsert + SHA-256 hashing |
| Testing  | Vitest, Supertest                                   |
| Monorepo | npm workspaces                                      |

## Project Structure

```
├── backend/
│   └── src/
│       ├── features/
│       │   ├── mutant/          # DNA analysis (route, controller, service, repository, schema)
│       │   └── stats/           # Statistics (route, controller, service, repository)
│       ├── shared/
│       │   ├── lib/             # Database client, logger
│       │   ├── middlewares/     # CORS, request logging
│       │   └── types/           # Shared interfaces
│       ├── app.ts               # Express app (middleware + routes)
│       ├── server.ts            # Server entry point
│       └── config.ts            # Environment validation
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── scanner/         # DNA input, grid visualization, analysis
│       │   └── stats/           # Statistics dashboard, donut chart
│       └── shared/
│           ├── components/      # Header, ErrorBoundary, NotFound
│           ├── lib/             # API client
│           └── utils/           # Utilities (cn)
└── package.json                 # Monorepo root (npm workspaces)
```
