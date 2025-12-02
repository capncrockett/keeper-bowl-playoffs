# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Playoff bracket visualization UI for a Sleeper fantasy football keeper league. The app visualizes three interrelated brackets (Champ Bowl, Keeper Bowl, Toilet Bowl) with custom routing rules where losers from Champ Bowl flow into Keeper Bowl, and winners from Toilet Bowl feed into Keeper Bowl.

**Current State:** Fully functional React SPA with both "If Today" preview mode and Live playoffs mode. Features responsive design with mobile-optimized layouts. Direct calls to Sleeper public APIs. Backend proxy may be added later (caching/rate-limiting).

## Tech Stack

- React 19.2 + Vite 7 + TypeScript 5.9
- Tailwind CSS 4.1 + DaisyUI 5.5
- react-router-dom 7.9 for routing
- ESLint 9 + Prettier 3.6

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint TypeScript files
npm run lint

# Format check
npm format

# Format and write
npm run format:write
```

## Code Architecture

### Directory Structure

```
src/
├── api/
│   └── sleeper.ts                    # Sleeper API client (typed fetch wrappers + playoff bracket endpoints)
├── bracket/
│   ├── types.ts                      # BracketSlot, BracketSlotId, Position types
│   ├── template.ts                   # BRACKET_TEMPLATE (immutable structure)
│   ├── routingRules.ts               # ROUTING_RULES (winner/loser flows)
│   ├── seedAssignment.ts             # assignSeedsToBracketSlots()
│   └── state.ts                      # applyGameOutcomesToBracket() routing engine
├── components/
│   ├── bracket/
│   │   ├── Bracket.tsx               # Main container (3 sub-brackets)
│   │   ├── BracketGrid.tsx           # Shared grid layout with absolute positioning
│   │   ├── BracketTile.tsx           # Responsive matchup card (mobile minimal/desktop rich)
│   │   ├── ChampBracket.tsx          # Champ Bowl layout definition
│   │   ├── KeeperBracket.tsx         # Keeper Bowl layout definition
│   │   ├── ToiletBracket.tsx         # Toilet Bowl layout definition
│   │   ├── BracketMatchShell.tsx     # Wrapper with anchors for connectors
│   │   ├── BracketColumn.tsx         # Legacy column component
│   │   ├── BracketRoundColumn.tsx    # Legacy round component
│   │   └── layoutReference/          # Visual layout planning documents
│   ├── matchups/
│   │   └── MatchupCard.tsx           # Weekly matchup results card
│   └── ThemeSelector.tsx             # DaisyUI theme switcher (light/dark/cupcake/synthwave)
├── models/
│   └── fantasy.ts                    # Team, PairedMatchup domain types
├── pages/
│   ├── PlayoffsIfTodayPage.tsx       # Preview bracket (seeded from current standings)
│   ├── PlayoffsLivePage.tsx          # Live playoff bracket (real game outcomes)
│   ├── MatchupsPage.tsx              # Weekly matchup results
│   └── StandingsPage.tsx             # Season standings table
└── utils/
    ├── sleeperTransforms.ts          # Sleeper data -> Teams, seeds, standings
    ├── sleeperPlayoffTransforms.ts   # Sleeper playoff matchups -> BracketGameOutcomes
    └── applyMatchupScores.ts         # Apply current/projected points to bracket slots
```

### Bracket Engine (Most Critical System)

The bracket system is **data-driven and immutable**. Understanding this is key to making changes.

#### Core Files

- `bracket/types.ts` - Type definitions for slots, routing rules, team references
- `bracket/template.ts` - `BRACKET_TEMPLATE`: declarative structure of all 15 playoff slots across 3 brackets
- `bracket/routingRules.ts` - `ROUTING_RULES`: defines winner/loser movement between slots (e.g., Champ R1 loser -> Keeper Floater)
- `bracket/seedAssignment.ts` - `assignSeedsToBracketSlots()`: places teams into initial bracket positions
- `bracket/state.ts` - `applyGameOutcomesToBracket()`: immutable routing engine that applies game results

#### How It Works

1. Fetch Sleeper users/rosters -> compute standings -> assign seeds 1-12
2. Start with `BRACKET_TEMPLATE` (immutable baseline structure)
3. Call `assignSeedsToBracketSlots(teams)` to populate initial positions
4. For live playoffs: apply real game outcomes via `applyGameOutcomesToBracket(slots, outcomes)`
5. Render via `<Bracket />` component

**Key Principle:** Never mutate `BRACKET_TEMPLATE`. Always clone slots before applying outcomes.

#### Bracket Structure

- **Champ Bowl**: Seeds 1-6, traditional bracket with R1 -> R2 -> Finals + 3rd place
- **Keeper Bowl**: Fed by Champ Bowl losers and Toilet Bowl winners. Contains Floater/Splashback games leading to 5th-8th place
- **Toilet Bowl**: Seeds 7-12, bottom bracket with R1 -> R2 -> Poop King final + placement games

### Data Flow

```
Sleeper API -> sleeperTransforms.ts -> Team models -> bracket/seedAssignment.ts -> BracketSlot[]
                                                                                      ↓
                                                                            Bracket components
```

**Important Transforms:**

- `mergeRostersAndUsersToTeams()` in `utils/sleeperTransforms.ts` - combines raw Sleeper data into `Team` objects
- `computeSeeds()` - converts standings rank to playoff seeds with custom tiebreakers
- `assignSeedsToBracketSlots()` - maps seeds to bracket positions

### Components

#### Bracket Components

- `<Bracket />` - Main container that organizes 3 sub-brackets with mode toggle (score/reward)
- `<BracketGrid />` - Shared layout engine using absolute positioning with `topPct` values and height scaling
  - Handles responsive column heights, gaps, and spacing
  - Maps layout definitions to rendered `<BracketTile />` components
- `<BracketTile />` - Fully responsive matchup card with two modes:
  - **Mobile (<768px)**: Minimal Sleeper-style design (avatar + name + score only)
  - **Desktop (≥768px)**: Rich cards with seed, record, reward text, and detailed layout
- `<ChampBracket />`, `<KeeperBracket />`, `<ToiletBracket />` - Define layout structures (columns, items, topPct positioning)
- `<BracketMatchShell />` - Wrapper with top/bottom anchors for future connector lines
- `<MatchupCard />` - Used in matchups page for weekly results
- `<ThemeSelector />` - DaisyUI theme picker with localStorage persistence

### Pages

- `/playoffs/if-today` - Preview bracket seeded from current standings (fully functional)
- `/playoffs/live` - Real playoff bracket with live game outcomes from Sleeper (fully functional)
- `/matchups` - Weekly matchup results
- `/standings` - Season standings table

**Both playoff pages share:**

- Mode toggle: Score view (shows current/projected points) vs Reward view (shows prize text)
- Team selector: Highlight a specific team across the bracket
- Responsive layout: Mobile-first design with desktop enhancements

## Current Development Phase

**Phase 4 (COMPLETE):** Live Playoffs Mode

- ✅ Sleeper winners_bracket/losers_bracket endpoints integrated
- ✅ `toBracketGameOutcomes()` transform implemented
- ✅ Live bracket page with real game outcomes
- ✅ Full responsive design (mobile + desktop)

**Phase 3.2 (COMPLETE):** Bracket Geometry + Spacing

- ✅ Fully responsive BracketTile component
- ✅ Mobile-optimized minimal cards (<768px)
- ✅ Desktop rich cards (≥768px) with seed, record, reward text
- ✅ Responsive spacing normalized across all components
- ⏸️ Connectors paused (Phase 3.3)

**Current Status:** App is feature-complete with both preview and live bracket modes. Next work would be:

- Phase 5: Keeper + Toilet visual refinements
- Phase 3.3: Resume connector lines (currently paused)
- Phase 6: Optional visual style pass (user-owned)
- Phase 7: Release/hosting/QA

## Testing & Quality

**No test framework is currently configured.** Before writing tests, check if one has been added to package.json.

Run linting before committing:

```bash
npm run lint
```

## Important Notes

- **League ID:** Hardcoded in pages (look for `LEAGUE_ID` constants). Consider moving to environment variables for multi-league support.
- **Sleeper API Rate Limits:** No caching currently implemented. Be mindful when fetching during development.
- **Routing Rules:** Changes to playoff bracket flow require updating `ROUTING_RULES` in `bracket/routingRules.ts`. These rules are separate from the template structure.
- **BYE Handling:** Some slots have `isBye: true` in positions. UI components handle BYE display differently than normal matchups.
- **Responsive Design:** The app uses Tailwind breakpoint `md:` (768px) to switch between mobile and desktop layouts. All spacing, text sizes, and card layouts adapt at this breakpoint.
- **Theme System:** Uses DaisyUI themes with localStorage persistence. Current themes: light, cupcake, synthwave, dark.

## Common Patterns

### Adding a New Bracket Slot

1. Add new `BracketSlotId` to `bracket/types.ts`
2. Add slot definition to `BRACKET_TEMPLATE` in `bracket/template.ts`
3. Add routing rules to `ROUTING_RULES` in `bracket/routingRules.ts`
4. Update relevant bracket layout definition in `ChampBracket.tsx`/`KeeperBracket.tsx`/`ToiletBracket.tsx`
   - Add item to appropriate column with `slotId` and `topPct` positioning
   - Optionally set `centerOnPct: true` for vertical centering

### Fetching Sleeper Data

```typescript
import {
  getLeagueUsers,
  getLeagueRosters,
  getWinnersBracket,
  getLosersBracket,
} from '@/api/sleeper';

// For If-Today mode (standings-based)
const users = await getLeagueUsers(leagueId);
const rosters = await getLeagueRosters(leagueId);

// For Live mode (actual playoff results)
const winnersBracket = await getWinnersBracket(leagueId);
const losersBracket = await getLosersBracket(leagueId);
```

### Building Teams from Sleeper Data

```typescript
import { mergeRostersAndUsersToTeams, computeSeeds } from '@/utils/sleeperTransforms';

const teams = mergeRostersAndUsersToTeams(rosters, users);
const teamsWithSeeds = computeSeeds(teams);
```

### Applying Live Playoff Outcomes

```typescript
import { assignSeedsToBracketSlots } from '@/bracket/seedAssignment';
import { applyGameOutcomesToBracket } from '@/bracket/state';
import { BRACKET_TEMPLATE } from '@/bracket/template';
import { ROUTING_RULES } from '@/bracket/routingRules';
import { toBracketGameOutcomes } from '@/utils/sleeperPlayoffTransforms';

// Start with template + seed assignment
const initialSlots = assignSeedsToBracketSlots([...BRACKET_TEMPLATE], teams);

// Convert Sleeper playoff data to outcomes
const outcomes = toBracketGameOutcomes(winnersBracket, losersBracket);

// Apply routing
const liveSlots = applyGameOutcomesToBracket(initialSlots, outcomes, ROUTING_RULES);
```

### Working with BracketGrid Layouts

```typescript
import type { BracketLayoutColumn } from '@/components/bracket/BracketGrid';

// Define column structure
const columns: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    items: [
      { id: 'r1-g1', slotId: 'champ_r1_g1', topPct: 20 },
      { id: 'r1-g2', slotId: 'champ_r1_g2', topPct: 60 },
    ],
  },
  {
    title: 'Round 2',
    items: [{ id: 'r2-g1', slotId: 'champ_r2_g1', topPct: 40, centerOnPct: true }],
    heightScale: 1.2, // Stretch vertical spacing
  },
];
```

## Roadmap Context

Refer to `/ROADMAP.md` (parent directory) for detailed phase breakdowns. Each phase is designed to be self-contained for agent handoffs.
