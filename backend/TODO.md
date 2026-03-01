# Backend — Improvement Opportunities

All items identified during code review have been resolved.

---

## Resolved

### Critical

- [x] **#1 Global error handler** — Added error-handling middleware in `app.ts` as last `app.use()`. Catches CORS errors (403), JSON parse errors (400), and unexpected throws (500).
- [x] **#2 CORS rejects with raw 500** — Resolved by #1. CORS errors now return `{ error: 'Origin not allowed' }` with 403.
- [x] **#3 Config silently accepts missing credentials** — Added `validateConfig()` in `config.ts`, called at startup in `server.ts`. Fails fast with descriptive error.
- [x] **#10 `app.listen` guard checks wrong condition** — Extracted `listen()` into `server.ts`. `app.ts` is now purely the Express app (no side effects), testable without port conflicts.

### Nice-to-have

- [x] **#6 403 for non-mutant is semantically odd** — Added comment `// Per challenge spec: 200 = mutant, 403 = human` in controller.
- [x] **#7 Race condition on concurrent duplicate DNA** — Replaced check-then-insert with `upsert({ onConflict: 'dna_hash' })`. Atomic, no race condition.
- [x] **#8 Unused `crypto-js` dependency** — Removed from `package.json`. Node's built-in `crypto` is used instead.
- [x] **#5 Health check has no DB verification** — Added `GET /health` endpoint that queries Supabase and returns 503 if unreachable.
- [x] **#13 No JSON 404 catch-all** — Added `app.use()` before error handler that returns `{ error: 'Not found' }` with 404.
- [x] **#9 No request logging** — Added lightweight `requestLogger` middleware (`METHOD /path STATUS durationMs`).

### Optional

- [x] **#4 No explicit body size limit / max matrix size** — Set `express.json({ limit: '1mb' })` and added `.max(1000)` to Zod array schema.
- [x] **#11 `StatsResponse` type defined but unused** — Now typed in `stats.controller.ts`.
- [x] **#12 Ratio rounding precision** — Changed from 1 decimal (`Math.round * 10 / 10`) to 2 decimals (`parseFloat(ratio.toFixed(2))`).
- [x] **#14 No security headers** — Added `helmet` middleware for standard security headers (X-Content-Type-Options, X-Frame-Options, etc.).
