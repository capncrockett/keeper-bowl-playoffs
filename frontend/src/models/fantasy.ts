// frontend/src/models/fantasy.ts

import type { SleeperRoster, SleeperUser, SleeperMatchup, SleeperNFLState } from '../api/sleeper';

// --- Internal domain models ---

export interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
}

export interface Team {
  teamName: string;
  ownerDisplayName: string;
  avatarUrl: string | null;
  sleeperRosterId: number;
  sleeperUserId: string;
  record: TeamRecord;
  pointsFor: number;
  pointsAgainst: number;
  rank: number; // 1-based rank in standings
  seed?: number; // 1–12, computed for playoffs
}

export interface PairedMatchup {
  matchupId: number;
  week: number;
  rosterIdA: number;
  rosterIdB: number | null; // handle odd cases / byes
  pointsA: number;
  pointsB: number;
}

export interface LiveMatchData {
  teamIdA: number;
  teamIdB: number | null;
  pointsA: number;
  pointsB: number;
  projectedA: number;
  projectedB: number;
  winProbA: number; // 0–1
  winProbB: number; // 0–1
  week: number;
}

export interface SeasonState {
  week: number;
  displayWeek: number;
  season: string;
  seasonType: string;
  leagueSeason: string;
}

// --- “Glue” types combining raw Sleeper + internal ---

export interface LeagueDataBundle {
  users: SleeperUser[];
  rosters: SleeperRoster[];
  matchups: SleeperMatchup[];
  nflState: SleeperNFLState;
}
