# Backend TODO — Matchup History Store

## Current state

- JSON store at `frontend/src/data/matchupHistoryStore.json` is the source for the UI.
- Backend adapter in `backend/matchupHistoryStore.ts` supports JSON and local SQLite (via `MATCHUP_STORE=sqlite`).
- Fetch CLI lives at `backend/scripts/updateMatchupHistory.ts`.

## Next steps (DB / hosting)

- Add a hosted adapter (Turso/libsql recommended; Postgres acceptable) under the existing `MatchupHistoryStore` interface.
- Env shape for hosted mode:
  - `MATCHUP_STORE=db`
  - Turso/libsql: `DB_URL`, `DB_AUTH_TOKEN`
  - Postgres: `DATABASE_URL` (with SSL flags as needed)
- Schema to create:
  ```
  CREATE TABLE matchups (
    week INTEGER NOT NULL,
    team TEXT NOT NULL,
    opponent TEXT NOT NULL,
    points_for REAL NOT NULL,
    points_against REAL NOT NULL,
    margin REAL NOT NULL,
    finished BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (week, team)
  );
  CREATE INDEX idx_matchups_week ON matchups(week);
  ```
- Migration script: create table if missing; optionally backfill from the JSON store.
- Decide consumption path for the frontend:
  1. Mirror DB writes back to JSON so UI stays file-based, or
  2. Add a tiny API route/serverless function to serve matchup history from DB and point the UI at it.
- Deploy/run the fetcher on a schedule (GitHub Actions/Vercel Cron) between MNF end and Wednesday stat corrections.

## Nice-to-haves

- Healthcheck/logging around fetch jobs (rows written, weeks covered).
- Simple admin command to re-run a week or wipe/reload a week from DB.
- README/ops notes for DB setup and envs once adapter is in.
