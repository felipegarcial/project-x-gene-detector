# X-Gene Detector

Full-stack application that analyzes DNA sequences to detect mutant gene patterns. Built with React 19, Express 5, and Supabase.

## Table of Contents

- [Quick Start](#quick-start)
- [API](#api)
- [Testing](#testing)
- [Architecture](#architecture)
- [Algorithm](#algorithm)
- [Scaling Architecture](#scaling-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

## Quick Start

### Prerequisites

- Node.js >= 22
- npm >= 10
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
npm run build        # builds both frontend and backend
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
npm test                                    # runs backend + frontend tests
npm run test:coverage --workspace=backend   # backend coverage report
npm run test:coverage --workspace=frontend  # frontend coverage report
```

Integration tests (require a test Supabase instance):

```bash
cp backend/.env.test.example backend/.env.test
# Fill in test DB credentials
npm run test:integration --workspace=backend
```

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
- **Position-first** — at each cell, all 4 directions are checked before moving on, avoiding directional bias
- **Cache-before-compute** — duplicate DNA submissions return the cached result from the database without re-running the algorithm

## Scaling Architecture

> Full architecture diagram: [`docs/scaling-architecture.pdf`](docs/scaling-architecture.pdf)

Architecture designed to handle **traffic fluctuations from 100 to 1,000,000 requests per second** on AWS.

### Request Flows

**Frontend (static assets):**

```
Client → Route 53 → CloudFront → S3
```

**DNA Analysis (write path):**

```
Client → Route 53 → WAF → ALB → Fargate /mutant/* → Redis (cache check)
                                       │                    │
                                       │              cache hit → respond
                                       │
                                       └→ isMutant() → Redis (cache write) → SQS → respond
                                                                               │
                                                              SQS Consumer → RDS Proxy → Aurora Write
                                                              (batch INSERT 500 rows)
```

**Statistics (read path):**

```
Client → Route 53 → WAF → ALB → Fargate /stats/* → Redis (5s TTL cache)
                                                         │
                                                   cache miss → RDS Proxy → Aurora Read
```

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **ECS Fargate** over Lambda | Avoids cold starts at sustained high throughput. Fargate tasks are always warm. |
| **Separate /mutant/ and /stats/ services** | Resource isolation — write-heavy DNA analysis doesn't compete with read-heavy stats queries. Independent scaling. |
| **ElastiCache Redis** as first-line cache | Absorbs 99%+ of reads. At 1M req/s, most DNA has already been analyzed. Redis handles 100K-200K ops/s per shard. |
| **Redis cluster with 6–12 shards and read replicas** | At 1M req/s with ~2M Redis ops/s (cache check + write), 6–12 shards provide sufficient throughput. Read replicas across AZs for high availability. |
| **Amazon SQS** for async writes | Decouples the HTTP response from database persistence. Client gets 200/403 immediately; the write happens asynchronously. |
| **Batch writes (500 rows/batch)** | Converts ~1M individual inserts/s into ~2K bulk inserts/s. Aurora can handle this comfortably. |
| **RDS Proxy** | Connection pooling — prevents hundreds of Fargate tasks from each holding a direct database connection. Reduces Aurora failover time from ~30s to ~1s. |
| **Aurora PostgreSQL** over standard RDS | Distributed storage layer, automatic failover, auto-scaling read replicas. Up to 5x throughput of standard PostgreSQL. |
| **WAF** over API Gateway | API Gateway has a 10K req/s default limit and would cost ~$300K/day at 1M req/s. WAF + ALB handles the scale natively at a fraction of the cost. |
| **VPC Endpoints** over NAT Gateway | Private connectivity to AWS services (ECR, SQS, CloudWatch, Secrets Manager) without internet routing. Lower latency, lower cost, no throughput bottleneck. |
| **Multi-AZ** (2 availability zones) | High availability — if one datacenter fails, the other continues serving traffic. ALB, Fargate, Redis, and Aurora are all distributed across AZs. |
| **Auto Scaling on all Fargate services** | Dynamic task count based on CPU utilization and request load. Scales from tens of tasks to hundreds in minutes. |

### Scaling Estimates

| Component | Low traffic | 1M req/s | Scaling metric |
|-----------|------------|----------|----------------|
| Fargate `/mutant/*` | ~50 tasks | ~500 tasks | CPU > 60%, requests/target |
| Fargate `/stats/*` | ~10 tasks | ~50 tasks | CPU > 60% |
| Fargate SQS Consumer | ~5 tasks | ~50 tasks | Queue depth > 1000 messages |
| ElastiCache Redis | 6 shards | 12 shards | Memory and ops/s per shard |
| Aurora Read Replicas | 1 replica | 2–4 replicas | CPU > 60% |

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Frontend | React 19, Vite 7, Tailwind CSS v4, Framer Motion   |
| Backend  | Express 5, TypeScript 5.9, Zod, Pino, Helmet       |
| Database | Supabase (PostgreSQL) with upsert + SHA-256 hashing |
| Testing  | Vitest, Supertest, Testing Library                  |
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
│       │   ├── middlewares/     # CORS, request logging, rate limiting
│       │   └── types/          # Shared interfaces
│       ├── app.ts              # Express app (middleware + routes)
│       ├── server.ts           # Server entry point
│       └── config.ts           # Environment validation
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── scanner/         # DNA input, grid visualization, analysis
│       │   └── stats/           # Statistics dashboard, donut chart
│       └── shared/
│           ├── components/      # Header, ErrorBoundary, NotFound
│           ├── lib/             # API client
│           └── utils/           # Utilities (cn)
├── docs/
│   └── scaling-architecture.pdf # AWS architecture diagram (1M req/s)
└── package.json                 # Monorepo root (npm workspaces)
```
