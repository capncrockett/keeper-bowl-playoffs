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

---

## Future Enhancements (Nice-to-Have)

### Enhanced Matchup Projections

**Goal:** Display accurate projected scores and win probabilities on the Matchups page.

**Current State:**
- Matchup cards show current scores only
- Win probability removed (not available from Sleeper API)
- Basic `getPlayerProjections()` API client exists but is unused
- Projection API: `https://api.sleeper.com/projections/nfl/{season}/{week}`

**What's Needed:**

1. **Fetch Player Projections**
   - Call `getPlayerProjections(season, week)` for current week
   - Returns array of projections keyed by `player_id` with scoring formats (std/half_ppr/ppr)

2. **Map to Team Totals**
   - For each matchup, get roster's starter player IDs from `SleeperMatchup.starters`
   - Look up each starter's projection
   - Sum projected points based on league scoring format (need to detect from league settings)
   - Add to current points for players who haven't played yet

3. **Calculate Win Probability**
   - Simple approach: `winProbA = projectedA / (projectedA + projectedB)`
   - Better approach: Use statistical model considering variance, time remaining, players left to play
   - Note: Will never match Sleeper's proprietary win probability calculation

4. **UI Updates**
   - Show projected totals on MatchupCard
   - Add win probability percentages back to cards
   - Add disclaimer: "Projections are estimates and may differ from Sleeper's calculations"

**Technical Notes:**
- Projections API is separate domain: `api.sleeper.com` vs `api.sleeper.app`
- May require league settings fetch to determine scoring format
- Additional API calls per week view (consider caching)
- Player projections change throughout the week as games complete

**Files to Modify:**
- `src/utils/sleeperTransforms.ts` - Enhance `buildLiveMatchData()` to use real projections
- `src/pages/MatchupsPage.tsx` - Fetch projections alongside matchups
- `src/components/matchups/MatchupCard.tsx` - Re-enable win probability display
- `src/models/fantasy.ts` - Potentially add `LeagueSettings` type for scoring format

**Estimated Effort:** Medium (4-6 hours)
- API integration is straightforward
- Complexity is in mapping player IDs to projections and handling edge cases
- Testing across different weeks and scoring formats

### Players Yet To Play Tracking

**Goal:** Show how many starters have finished playing vs yet to play on matchup cards.

**Current State:**
- Matchup cards only show current scores
- No indication of game progress or remaining players
- `startersA` and `startersB` fields exist in data model but not displayed

**Approach Options:**

1. **Use ESPN's undocumented API** (Recommended - Free)
   - ESPN scoreboard API: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=2&week={week}`
   - Returns game status: `STATUS_SCHEDULED`, `STATUS_IN_PROGRESS`, `STATUS_FINAL`, `STATUS_HALFTIME`, etc.
   - Get all players from Sleeper (`https://api.sleeper.app/v1/players/nfl`)
   - Cross-reference player team with ESPN game status to determine if game is complete
   - Count starters whose games are `STATUS_FINAL` vs still in progress

2. **Use Sleeper Stats API**
   - `https://api.sleeper.com/stats/nfl/{season}/{week}?season_type=regular`
   - Check if player has non-zero stats (indicates they've played)
   - Less reliable: player could be active but have 0 stats

3. **Use NFL.com GameCenter JSON** (Mentioned in StackOverflow)
   - `http://www.nfl.com/liveupdate/game-center/{game_id}/{game_id}_gtd.json`
   - Updates every ~15 seconds during live games
   - Would need to maintain mapping of game IDs

**Implementation Steps (ESPN Approach):**

1. Add ESPN API client function: `getESPNScoreboard(week)`
2. Fetch all NFL players once per day (cache in localStorage)
3. Build map of `player_id -> NFL_team`
4. Fetch ESPN scoreboard for current week
5. Create map of `NFL_team -> game_status`
6. For each starter in matchup:
   - Look up player's NFL team
   - Check if team's game is `STATUS_FINAL`
   - Increment `playersFinished` or `playersYetToPlay` count
7. Update UI:
   - Show "X/Y finished" under each team score
   - Add visual bar showing ratio of finished players
   - Update as games progress (requires periodic refresh)

**Data Model Changes:**
```typescript
interface LiveMatchData {
  // ... existing fields
  playersFinishedA: number;
  playersFinishedB: number;
}
```

**UI Changes:**
- Add "5/9 finished" text under scores
- Add progress bar showing completion ratio
- Consider color coding: green for all done, yellow for in progress

**Estimated Effort:** Medium (6-8 hours)
- ESPN API integration
- Player data caching and mapping
- Cross-referencing logic
- UI updates
- Testing with live games
