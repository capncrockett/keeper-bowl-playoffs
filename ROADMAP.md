# Keeper Bowl Playoffs — Roadmap

This roadmap is written so we can spin up a new agent/chat and point it at a specific section. Each phase is self‑contained, with explicit goals, inputs/outputs, and checklists. No color/theme work is assumed unless a section says so.

---

## Phase 0 — Project Foundation (DONE)

**Goal:** Get a working React/Vite + Tailwind + DaisyUI + TS app scaffolded with routing and dev tooling.

**Delivered:**

- React + Vite + TypeScript app
- Tailwind + DaisyUI configured
- ESLint + Prettier configured
- Basic routes/pages wired
- Sleeper API endpoint docs added

**No further work here unless tooling changes.**

---

## Phase 1 — Sleeper Data Layer (DONE)

**Goal:** Typed Sleeper client + transforms that produce Teams, seeds, standings.

**Delivered:**

- Typed Sleeper API client with league users/rosters/matchups
- `Team` model with record, avatars, names
- Standings and `computeSeeds()` transform
- Utility merges: `mergeRostersAndUsersToTeams()`

**No further work here unless new Sleeper endpoints are needed.**

---

## Phase 2 — Bracket Data Model + Engine (DONE)

**Goal:** Encode the PDF/Excel playoff structure and routing logic in code.

**Delivered:**

- `BRACKET_TEMPLATE` matching the Grundle Playoffs PDF
  - Champ Bowl rounds
  - Keeper Bowl flows (Floaters, Splashbacks, 5th/6th, 7th/8th)
  - Toilet Bowl rounds (Poop King, 9th/10th)
- `ROUTING_RULES` describing winner/loser movement between slots
- Seed placement: `assignSeedsToBracketSlots(teams)`
- Immutable routing engine: `applyGameOutcomesToBracket(slots, outcomes, rules)`

**No further work here unless bracket rules change.**

---

## Phase 3 — If‑Today Bracket View (MOSTLY DONE)

**Goal:** A functional bracket preview based on current standings.

**Current state:**

- `/playoffs/if-today` fetches users/rosters
- Seeds computed and assigned into bracket
- Bracket renders in 3 columns (R1 → R2 → Finals/Placement)
- Highlighting + PvP header works
- Score/Reward mode toggle works

### 3.1 — UI Structure + Card Baseline (DONE)

Checklist:

- [x] `BracketMatchShell` anchors added
- [x] Champ cards outlined (BYE + games)
- [x] Champ bracket functional layout stable

### 3.2 — Bracket Geometry + Spacing (DONE)

**Goal:** Make Champ/Keeper/Toilet _look_ like a bracket even before connectors.

**Delivered:**

- Fully responsive BracketTile component with mobile/desktop variants
- Mobile (<768px): Sleeper-style minimal cards (avatar + name + score)
- Desktop (≥768px): Rich cards with seed, record, and reward text
- Responsive spacing normalized across all components
- Removed redundant card wrappers
- Cards adapt to screen size for optimal readability

Checklist:

- [x] Normalize card heights across all bracket tiles
  - Responsive padding and consistent card structure
  - Mobile-optimized minimal design
- [x] Align vertical rhythm so rounds visually ladder
  - Responsive gaps: tight on mobile, generous on desktop
- [x] Reduce excess whitespace
  - Mobile: gap-2, Desktop: gap-4 to gap-8
  - Optimized for mobile readability
- [x] Group placement games cleanly under Finals
  - BracketColumn component handles grouping
  - Responsive grid layout
- [ ] Add tiny flow labels (text only, no styling pass)
  - "Rimmers →", "Flushed →", "Floaters", "Splashbacks"
  - Deferred for future iteration

**Deliverable:** Responsive bracket layout that adapts to mobile and desktop.

### 3.3 — Connectors (PAUSED)

**Goal:** Draw bracket connector lines once geometry is stable.

Checklist:

- [ ] Re‑enable connectors on Champ only
- [ ] Switch from raw `<line>` to elbow/bracket paths
- [ ] Add connection map for Keeper/Toilet
- [ ] Ensure connectors rerender on resize + mode toggle

**Note:** User explicitly paused this; resume after 3.2.

---

## Phase 4 — Live Playoffs Mode (DONE)

**Goal:** `/playoffs/live` shows the _real_ in‑progress playoff bracket from Sleeper.

**Delivered:**

- Sleeper playoff bracket API integration (winners_bracket/losers_bracket endpoints)
- `SleeperPlayoffMatchup` type and client functions
- `toBracketGameOutcomes()` transform utility
- Full PlayoffsLivePage implementation with live data fetching
- Game outcomes applied through routing engine
- UI reuses patterns from If-Today page (mode toggle, team selector, PvP header)

### 4.1 — Data Fetch + Normalization (DONE)

Checklist:

- [x] Add Sleeper calls:
  - `/league/{leagueId}/winners_bracket`
  - `/league/{leagueId}/losers_bracket`
- [x] Define TS types for Sleeper bracket payloads
- [x] Write `toBracketGameOutcomes()`:
  - Map each Sleeper game to `{ slotId, winnerIndex }`
  - Handle unplayed games (`winner = null`)
  - Confirm Sleeper IDs map to your `teamId`/`rosterId` scheme

### 4.2 — Apply Outcomes to Template (DONE)

Checklist:

- [x] Start from `BRACKET_TEMPLATE`
- [x] Apply `assignSeedsToBracketSlots()` for baseline population
- [x] Feed outcomes into `applyGameOutcomesToBracket()`
- [x] Verify downstream placement matches routing rules

### 4.3 — Live Page + UI (DONE)

Checklist:

- [x] Create `/playoffs/live` page
- [x] Reuse `<Bracket />` component
- [x] Add page header, controls identical to If‑Today
- [x] Show winners/losers status in cards (handled by bracket routing)

**Deliverable:** Live bracket page displays correct real bracket state.

---

## Phase 5 — Keeper + Toilet Full UI Completion

**Goal:** Bring Keeper Bowl and Toilet Bowl visuals up to Champ level.

Checklist:

- [ ] Apply Phase 3.2 geometry rules to Keeper + Toilet columns
- [ ] Standardize card heights + spacing
- [ ] Ensure routing placement reads top‑to‑bottom intuitively
- [ ] Validate reward text and labels per PDF

**Deliverable:** All three brackets look coherent and readable.

---

## Phase 6 — Visual Style Pass (USER‑OWNED, LATER)

**Goal:** Theme/color tweaks, Sleeper‑style polish, optional animations.

Checklist (optional):

- [ ] Decide light/dark theme handling
- [ ] Apply final DaisyUI theme tokens
- [ ] Add hover/selection micro‑interactions
- [ ] Optional subtle animations on highlight

**Note:** Only start this when user says “go on styling.”

---

## Phase 7 — Release / Hosting / QA

**Goal:** Ship a stable app.

Checklist:

- [ ] Smoke test all routes
- [ ] Verify Sleeper API errors are surfaced cleanly
- [ ] Confirm works on mobile widths
- [ ] Add minimal README usage notes
- [ ] Deploy to chosen host (Render/Azure/AWS)

---

## Open Questions / Parking Lot

- Connectors: SVG vs CSS pseudo‑elements decision after geometry is locked
- How to represent BYE games in Live mode if Sleeper omits them
- Whether to cache Sleeper responses for rate limits
