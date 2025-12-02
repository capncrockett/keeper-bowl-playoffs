# Testing Strategy & Roadmap (Phase 7)

This plan drives Phase 7 (Release / Hosting / QA). Bias toward integration tests in Jest, keep unit tests minimal (pure utilities only), and reserve a small Playwright suite for end-to-end smoke.

## Principles

- Integration-first: use Jest + React Testing Library to exercise pages/components with realistic data and routing.
- Minimal unit tests: only for deterministic helpers (bracket transforms, routing rules, score math).
- Slim e2e: Playwright for top-level smoke flows (navigation, route content, mobile widths), not full regression.
- Fast feedback: keep tests hermetic via mock fetch/fixtures; avoid hitting Sleeper/ESPN APIs.

## Tooling Setup (to do)

- Add Jest with jsdom: `jest`, `ts-jest`, `@types/jest`, `jest-environment-jsdom`, `babel-jest` (or `ts-jest` in ESM mode), and a `jest.config.ts`.
- React Testing Library stack: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`.
- Network mocks: prefer `msw` for request interception; fall back to `jest.spyOn(global, 'fetch')` when simpler.
- Playwright: `@playwright/test` with a `playwright.config.ts` for desktop + iPhone-sized viewports.
- Scripts to add later: `test`, `test:watch`, `test:ci`, `test:e2e`, `test:e2e:headed`, plus a `lint:test` combo in CI.

## Workstreams & Owners (agents)

- **Agent Infra (A):** Jest config, scripts, and ts-jest/jsdom wiring; sets up Testing Library + jest-dom matchers; CI hook.
- **Agent Fixtures (B):** Build reusable Sleeper/league fixtures (`frontend/src/test/fixtures/...`), mock server helpers (msw), and a `renderWithRouter` test utility.
- **Agent Integration (C):** Page/component coverage in Jest (routing, nav highlighting, bracket tiles, matchups data + error surfacing).
- **Agent Resilience (D):** API failure cases (Sleeper outages), loading states, empty data, and mobile viewport snapshot sanity (jest-axe optional).
- **Agent E2E (E):** Playwright smoke: app boots, each route loads, nav works, mobile width layout holds, basic interaction (theme toggle optional).

## Initial Backlog (priority)

- Routing/nav
  - `/` redirects to `/matchups`; nav highlights active route; footer renders.
  - App survives unknown routes (404 redirect or behavior-as-implemented).
- Matchups page
  - Renders matchup cards from fixture; handles loading skeleton; shows API error banner/toast (ties to Phase 7 “surface errors cleanly”).
  - Optional: verify projected/actual scores formatting when data exists.
- Playoffs — If Today
  - Bracket tiles render seeds/bye placeholders from template; highlight logic toggles class when `highlightTeamId` present.
  - Mode switch (score vs reward) preserves layout.
- Playoffs — Live
  - Live data fixture renders without crashes; protects against missing starters/rosters; renders BYE rows correctly.
- Standings
  - Table renders sorted data; handles empty/partial standings payload.
- Layout/responsiveness
  - Snapshot/regression at mobile width for nav + bracket tiles (Jest with `window.innerWidth` mocks).
- Data boundaries
  - Utilities that map Sleeper data to internal models (pure functions) get unit tests.

## Playwright Smoke (thin)

- Load app, hit `/matchups`, `/playoffs/if-today`, `/playoffs/live`, `/standings`; assert key header text to prove render.
- Mobile viewport check (e.g., iPhone 12): nav buttons visible, overflow handled.
- Error overlay check: mock network 500 for Sleeper call, verify user-facing error text and non-crash.

## Definition of Done

- Jest suite runs in CI < 60s, deterministic with offline fixtures.
- Playwright smoke runs headless in CI and locally in ~2–3 minutes.
- Coverage on: routing/nav, bracket rendering, matchups data path, error surfacing, and at least one mobile-width assertion.
- README gains a short “Testing” snippet pointing here once scripts land.
