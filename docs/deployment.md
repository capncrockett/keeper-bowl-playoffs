# Deployment Strategy (Phase 7)

This is a short, actionable plan to ship the current frontend-only SPA and leave room for a later proxy/cache backend.

## What We’re Shipping Now

- React + Vite SPA in `frontend`, no server-side rendering.
- Direct, unauthenticated calls to Sleeper public APIs (CORS-friendly).
- Client-side routing via `BrowserRouter` (needs SPA rewrite on host).

## Recommended Target: Render Static Site (works similarly on Netlify/Cloudflare)

- Build command: `cd frontend && npm ci && npm run build`.
- Publish directory: `frontend/dist`.
- Node version: 20.x.
- SPA routing: add a single rewrite `/* -> /index.html` (Render dashboard) or include `public/_redirects` with `/* /index.html 200` for Netlify/Cloudflare.
- Caching: hashed assets from Vite are safe to cache long-term; keep `index.html` at a short TTL (host default is fine).
- Observability: start with Render request logs; optional Sentry/Logtail later via env vars.

## Config / Secrets

- League targeting: today the league ID is hard-coded in pages; before prod, centralize to `VITE_LEAGUE_ID` (and set it in the host) so we can change leagues without rebuilds.
- Optional envs to add later: `VITE_SENTRY_DSN`, `VITE_FEATURE_FLAGS` if we need remote toggles.
- No private API keys are required for Sleeper right now.

## CI/CD Flow

1. PRs: GitHub Actions job runs `npm ci`, `npm run lint`, and `npm run build` inside `frontend` (add tests once they exist). Post build artifact size + duration for visibility.
2. Main branch: same checks, then trigger a Render Deploy Hook (or Netlify build hook). Keep the hook secret in repo secrets.
3. Preview deploys: enable “PR previews” in the host to get per-branch URLs; gate merges on green CI.

## Release Readiness Checklist

- [ ] Add env-backed league ID so we’re not rebuilding for league swaps.
- [ ] Add SPA rewrite rule (`/* -> /index.html`).
- [ ] Create GitHub Action for lint/build (and tests later).
- [ ] Configure Render static site with build/publish settings + deploy hook.
- [ ] Run `npm run build` once on a clean tree to confirm the artifact (no network calls).

## Later: Backend Proxy (optional)

- Add a small Node service in `backend` to cache Sleeper responses, hide any future API keys, and rate-limit. Host as a Render Web Service or Azure Web App; front it with the same static site. Until then, the static deploy is sufficient.
