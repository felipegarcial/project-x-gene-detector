# Mutant DNA Detector

Full-stack application that detects mutant DNA sequences. Inspired by X-Men's Cerebro — Magneto's tool for recruiting mutants.

Built as a monorepo with **React** frontend and **Express** backend, connected to **Supabase** (PostgreSQL).

---

## Table of Contents

- [Architecture](#architecture)
- [Algorithm](#algorithm)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  React 19 + Vite + TypeScript + Tailwind CSS + Framer Motion    │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐                           │
│  │ ScannerPage  │    │  StatsPage   │                           │
│  │              │    │              │                           │
│  │ CerebroHero  │    │  StatCard x3 │                           │
│  │ DnaInput     │    │  (glass UI)  │                           │
│  │ DnaGrid      │    └──────┬───────┘                           │
│  │ ScanResult   │           │                                   │
│  └──────┬───────┘           │                                   │
│         │                   │                                   │
│         └───────┬───────────┘                                   │
│                 │ HTTP (apiFetch)                                │
└─────────────────┼────────────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│          Express 5 + TypeScript + Zod Validation                │
│                                                                  │
│  ┌────────────────────────┐  ┌─────────────────────────┐       │
│  │   POST /mutant/        │  │   GET /stats/            │       │
│  │                        │  │                          │       │
│  │  Schema Validation     │  │  Count mutant/human      │       │
│  │  ↓                     │  │  Calculate ratio          │       │
│  │  isMutant(dna)         │  │  Return stats JSON       │       │
│  │  ↓                     │  │                          │       │
│  │  Hash + Upsert to DB   │  └────────────┬─────────────┘       │
│  │  ↓                     │               │                     │
│  │  200 (mutant)          │               │                     │
│  │  403 (human)           │               │                     │
│  └────────────┬───────────┘               │                     │
│               │                           │                     │
│               └───────────┬───────────────┘                     │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                       SUPABASE                                   │
│                    (PostgreSQL)                                   │
│                                                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │  dna_records                                  │               │
│  │  ─────────────────────────────────────────    │               │
│  │  id           UUID PRIMARY KEY                │               │
│  │  dna_hash     VARCHAR(64) UNIQUE NOT NULL     │               │
│  │  dna_sequence TEXT[] NOT NULL                  │               │
│  │  is_mutant    BOOLEAN NOT NULL                │               │
│  │  created_at   TIMESTAMPTZ                     │               │
│  │                                               │               │
│  │  INDEX idx_dna_is_mutant (is_mutant)          │               │
│  └──────────────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────────────┘
```

**Key decisions:**

- **SHA-256 hash** of the DNA sequence as unique key — prevents duplicate records and enables O(1) lookup
- **Index on `is_mutant`** — optimizes the COUNT queries for stats (no full table scan)
- **Upsert pattern** — same DNA analyzed twice won't create duplicates (idempotent)
- **Position-first traversal** in the algorithm — avoids directional bias when consuming cells

---

## Algorithm

The core `isMutant(dna)` function uses **position-first traversal** to detect mutant DNA:

1. Scan the NxN matrix cell by cell (top-left to bottom-right)
2. At each cell, check all 4 directions: horizontal, vertical, diagonal-right, diagonal-left
3. A valid sequence is 4 consecutive identical bases (A, T, C, or G)
4. Cells used in one sequence **cannot be reused** in another
5. If 2+ sequences are found, the DNA is mutant — **early return**

**Why position-first?** A direction-first approach (find all horizontals, then verticals, etc.) creates bias: earlier directions consume cells that could form valid sequences in later directions. Position-first distributes detection evenly.

**Complexity:** O(N^2) time, O(N^2) space

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Express 5 | HTTP framework |
| TypeScript | Type safety |
| Zod | Request validation |
| Supabase JS | Database client |
| Vitest + Supertest | Testing |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI components |
| Framer Motion | DNA grid animations |
| Anime.js v4 | Cerebro SVG animation |
| React Router | Client-side routing |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A **Supabase** project (free tier works)

### 1. Clone and install

```bash
git clone <repository-url>
cd rental
npm install
```

### 2. Set up Supabase

Create a Supabase project and run the migration:

```bash
cd backend
npx supabase db push
```

Or manually execute the SQL in `backend/supabase/migrations/20260228055123_create_dna_records.sql`.

### 3. Configure environment variables

**Backend** — create `backend/.env`:

```bash
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**Frontend** — create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3001
```

### 4. Run in development

From the root directory:

```bash
# Start both backend and frontend
npm run dev

# Or individually:
npm run dev:backend   # Express on :3001
npm run dev:frontend  # Vite on :5173
```

### 5. Build for production

```bash
# Frontend build
npm run build
```

---

## API Endpoints

### `POST /mutant/`

Analyze a DNA sequence to detect if it belongs to a mutant.

**Request:**

```json
{
  "dna": ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
}
```

**Responses:**

| Status | Meaning |
|---|---|
| `200 OK` | Mutant detected — `{ "is_mutant": true }` |
| `403 Forbidden` | Human (not mutant) — `{ "is_mutant": false }` |
| `400 Bad Request` | Validation error (not NxN, invalid chars, < 4x4) |

### `GET /stats/`

Get aggregated statistics of all DNA analyses.

**Response:**

```json
{
  "count_mutant_dna": 40,
  "count_human_dna": 100,
  "ratio": 0.4
}
```

`ratio` = `count_mutant_dna / count_human_dna` (0 if no humans analyzed).

---

## Testing

### Unit tests (29 tests, 92.77% coverage)

```bash
cd backend
npm test              # Run all unit tests
npm run test:coverage # Run with coverage report
```

Tests cover:
- `mutant.service` — Algorithm (12 tests): mutant/human detection, edge cases, no-overlap rule
- `mutant.schema` — Validation (9 tests): NxN check, min size, valid chars, empty input
- `mutant.endpoint` — Controller (4 tests): 200/403 responses, error handling
- `stats.endpoint` — Controller (4 tests): stats response, zero-division ratio

### Integration tests

```bash
# Requires a test Supabase instance
# Create backend/.env.test with TEST_SUPABASE_URL and TEST_SUPABASE_ANON_KEY
npm run test:integration
```

Integration tests are **skipped by default** when `.env.test` is not present.

---

## Project Structure

```
rental/
├── package.json                 # Monorepo (npm workspaces)
│
├── backend/
│   ├── src/
│   │   ├── app.ts               # Express app + listen
│   │   ├── config.ts            # Env + algorithm defaults
│   │   ├── features/
│   │   │   ├── mutant/
│   │   │   │   ├── mutant.route.ts
│   │   │   │   ├── mutant.controller.ts
│   │   │   │   ├── mutant.service.ts      # isMutant() algorithm
│   │   │   │   ├── mutant.schema.ts       # Zod validation
│   │   │   │   ├── mutant.repository.ts   # DB upsert
│   │   │   │   └── __tests__/
│   │   │   └── stats/
│   │   │       ├── stats.route.ts
│   │   │       ├── stats.controller.ts
│   │   │       ├── stats.repository.ts    # COUNT queries
│   │   │       └── __tests__/
│   │   └── shared/
│   │       ├── lib/db/index.ts            # Supabase client (lazy init)
│   │       ├── middlewares/cors.ts
│   │       └── types/index.ts
│   ├── supabase/
│   │   └── migrations/                    # SQL migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                        # Router + layout
│   │   ├── main.tsx
│   │   ├── index.css                      # Tailwind + dark theme
│   │   ├── features/
│   │   │   ├── scanner/
│   │   │   │   ├── ScannerPage.tsx        # Page orchestrator
│   │   │   │   ├── scanner.service.ts     # API calls
│   │   │   │   ├── scanner.types.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── CerebroHero.tsx    # Animated SVG (Anime.js)
│   │   │   │   │   ├── DnaInput.tsx       # Textarea with normalization
│   │   │   │   │   ├── DnaGrid.tsx        # Matrix visualization (Framer Motion)
│   │   │   │   │   └── ScannerResult.tsx  # Mutant/human result
│   │   │   │   └── hooks/
│   │   │   │       └── useScanner.ts      # Scanner state + validation
│   │   │   └── stats/
│   │   │       ├── StatsPage.tsx
│   │   │       ├── stats.service.ts
│   │   │       ├── stats.types.ts
│   │   │       ├── components/
│   │   │       │   └── StatCard.tsx       # Glassmorphism card
│   │   │       └── hooks/
│   │   │           └── useStats.ts
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── Header.tsx
│   │       │   └── ui/                    # shadcn/ui components
│   │       ├── lib/
│   │       │   └── api.ts                 # apiFetch wrapper
│   │       └── utils/
│   │           └── index.ts               # cn() utility
│   └── package.json
│
└── README.md
```

---

## Author

**Felipe Garcia** — [pipegarcial](https://github.com/pipegarcial)
