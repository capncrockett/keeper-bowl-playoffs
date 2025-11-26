# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Playoff bracket visualization UI for a Sleeper fantasy football keeper league. The app visualizes three interrelated brackets (Champ Bowl, Keeper Bowl, Toilet Bowl) with custom routing rules where losers from Champ Bowl flow into Keeper Bowl, and winners from Toilet Bowl feed into Keeper Bowl.

**Current State:** Frontend-only React SPA. Direct calls to Sleeper public APIs. Backend proxy planned for later (caching/rate-limiting).

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS 4 + DaisyUI
- react-router-dom for routing
- ESLint + Prettier

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
├── api/          # Sleeper API client (typed fetch wrappers)
├── bracket/      # Core bracket engine (template, routing, transforms)
├── components/   # React components (bracket rendering, matchup cards)
├── models/       # Domain types (Team, PairedMatchup, etc.)
├── pages/        # Route pages (PlayoffsIfTodayPage, PlayoffsLivePage, etc.)
└── utils/        # Transform utilities (Sleeper data → Teams, seeds, standings)
```

### Bracket Engine (Most Critical System)

The bracket system is **data-driven and immutable**. Understanding this is key to making changes.

#### Core Files
- `bracket/types.ts` - Type definitions for slots, routing rules, team references
- `bracket/template.ts` - `BRACKET_TEMPLATE`: declarative structure of all 15 playoff slots across 3 brackets
- `bracket/routingRules.ts` - `ROUTING_RULES`: defines winner/loser movement between slots (e.g., Champ R1 loser → Keeper Floater)
- `bracket/seedAssignment.ts` - `assignSeedsToBracketSlots()`: places teams into initial bracket positions
- `bracket/state.ts` - `applyGameOutcomesToBracket()`: immutable routing engine that applies game results

#### How It Works
1. Fetch Sleeper users/rosters → compute standings → assign seeds 1-12
2. Start with `BRACKET_TEMPLATE` (immutable baseline structure)
3. Call `assignSeedsToBracketSlots(teams)` to populate initial positions
4. For live playoffs: apply real game outcomes via `applyGameOutcomesToBracket(slots, outcomes)`
5. Render via `<Bracket />` component

**Key Principle:** Never mutate `BRACKET_TEMPLATE`. Always clone slots before applying outcomes.

#### Bracket Structure
- **Champ Bowl**: Seeds 1-6, traditional bracket with R1 → R2 → Finals + 3rd place
- **Keeper Bowl**: Fed by Champ Bowl losers and Toilet Bowl winners. Contains Floater/Splashback games leading to 5th-8th place
- **Toilet Bowl**: Seeds 7-12, bottom bracket with R1 → R2 → Poop King final + placement games

### Data Flow

```
Sleeper API → sleeperTransforms.ts → Team models → bracket/seedAssignment.ts → BracketSlot[]
                                                                                      ↓
                                                                            Bracket components
```

**Important Transforms:**
- `mergeRostersAndUsersToTeams()` in `utils/sleeperTransforms.ts` - combines raw Sleeper data into `Team` objects
- `computeSeeds()` - converts standings rank to playoff seeds with custom tiebreakers
- `assignSeedsToBracketSlots()` - maps seeds to bracket positions

### Components

- `<Bracket />` - Main container that organizes 3 sub-brackets
- `<ChampBracket />`, `<KeeperBracket />`, `<ToiletBracket />` - Bracket-specific layouts
- `<BracketMatchShell />` - Individual game card with team display, scores, and reward text
- `<MatchupCard />` - Used in matchups page for weekly results

### Pages

- `/playoffs/if-today` - Preview bracket seeded from current standings
- `/playoffs/live` - Real playoff bracket (Phase 4, not yet implemented)
- `/matchups` - Weekly matchup results
- `/standings` - Season standings table

## Current Development Phase

**Phase 3.2:** Bracket Geometry + Spacing (per ROADMAP.md)
- Normalizing card heights across bracket tiles
- Aligning vertical rhythm so rounds visually ladder
- Grouping placement games under finals

**Next Major Feature:** Phase 4 - Live Playoffs Mode
- Fetch Sleeper winners_bracket/losers_bracket endpoints
- Map Sleeper game results to `BracketGameOutcome[]`
- Apply outcomes via routing engine

## Testing & Quality

**No test framework is currently configured.** Before writing tests, check if one has been added to package.json.

Run linting before committing:
```bash
npm run lint
```

## Important Notes

- **League ID:** Currently appears to be hardcoded in pages. Look for `LEAGUE_ID` constants or environment variables when making changes.
- **Sleeper API Rate Limits:** No caching currently implemented. Be mindful when fetching during development.
- **Routing Rules:** Changes to playoff bracket flow require updating `ROUTING_RULES` in `bracket/routingRules.ts`. These rules are separate from the template structure.
- **BYE Handling:** Some slots have `isBye: true` in positions. UI components handle BYE display differently than normal matchups.

## Common Patterns

### Adding a New Bracket Slot
1. Add new `BracketSlotId` to `bracket/types.ts`
2. Add slot definition to `BRACKET_TEMPLATE` in `bracket/template.ts`
3. Add routing rules to `ROUTING_RULES` in `bracket/routingRules.ts`
4. Update relevant bracket component layout (ChampBracket/KeeperBracket/ToiletBracket)

### Fetching Sleeper Data
```typescript
import { getLeagueUsers, getLeagueRosters } from '@/api/sleeper';

const users = await getLeagueUsers(leagueId);
const rosters = await getLeagueRosters(leagueId);
```

### Building Teams from Sleeper Data
```typescript
import { mergeRostersAndUsersToTeams, computeSeeds } from '@/utils/sleeperTransforms';

const teams = mergeRostersAndUsersToTeams(rosters, users);
const teamsWithSeeds = computeSeeds(teams);
```

## Roadmap Context

Refer to `/ROADMAP.md` (parent directory) for detailed phase breakdowns. Each phase is designed to be self-contained for agent handoffs.
