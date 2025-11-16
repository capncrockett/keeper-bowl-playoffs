// frontend/src/api/sleeper.ts

const SLEEPER_BASE_URL = 'https://api.sleeper.app/v1';

// --- Raw Sleeper API types (mirror docs) ---

export interface SleeperLeague {
  total_rosters: number;
  status: 'pre_draft' | 'drafting' | 'in_season' | 'complete';
  sport: 'nfl' | string;
  settings: Record<string, unknown>;
  season_type: 'pre' | 'regular' | 'post' | string;
  season: string;
  scoring_settings: Record<string, number>;
  roster_positions: string[];
  previous_league_id?: string;
  name: string;
  league_id: string;
  draft_id: string;
  avatar?: string | null;
}

export interface SleeperRosterSettings {
  wins?: number;
  losses?: number;
  ties?: number;
  fpts?: number;
  fpts_decimal?: number;
  fpts_against?: number;
  fpts_against_decimal?: number;
  [key: string]: number | undefined;
}

export interface SleeperRoster {
  starters: string[];
  settings: SleeperRosterSettings;
  roster_id: number;
  reserve: string[];
  players: string[];
  owner_id: string;
  league_id: string;
}

export interface SleeperUserMetadata {
  team_name?: string;
  [key: string]: string | undefined;
}

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar?: string | null;
  metadata?: SleeperUserMetadata;
  is_owner?: boolean; // commissioner flag
}

export interface SleeperMatchup {
  starters: string[];
  roster_id: number;
  players: string[];
  matchup_id: number;
  points: number;
  custom_points?: number | null;
}

export interface SleeperNFLState {
  week: number;
  season_type: 'pre' | 'regular' | 'post' | string;
  season_start_date: string;
  season: string;
  previous_season: string;
  leg: number;
  league_season: string;
  league_create_season: string;
  display_week: number;
}

async function sleeperFetch<T>(path: string): Promise<T> {
  const url = `${SLEEPER_BASE_URL}${path}`;

  const response = await fetch(url);

  if (!response.ok) {
    // You can add more robust logging / error boundaries later
    throw new Error(`Sleeper API error (${response.status}): ${response.statusText}`);
  }

  return (await response.json()) as T;
}

// --- Public client functions ---

export async function getLeague(leagueId: string): Promise<SleeperLeague> {
  return sleeperFetch<SleeperLeague>(`/league/${leagueId}`);
}

export async function getLeagueUsers(leagueId: string): Promise<SleeperUser[]> {
  return sleeperFetch<SleeperUser[]>(`/league/${leagueId}/users`);
}

export async function getLeagueRosters(leagueId: string): Promise<SleeperRoster[]> {
  return sleeperFetch<SleeperRoster[]>(`/league/${leagueId}/rosters`);
}

export async function getLeagueMatchupsForWeek(
  leagueId: string,
  week: number,
): Promise<SleeperMatchup[]> {
  return sleeperFetch<SleeperMatchup[]>(`/league/${leagueId}/matchups/${week}`);
}

export async function getNFLState(): Promise<SleeperNFLState> {
  return sleeperFetch<SleeperNFLState>('/state/nfl');
}

// Helpers for avatar URLs (full + thumb) as per docs
export function buildSleeperAvatarUrl(avatarId: string | null | undefined): string | null {
  if (!avatarId) return null;
  return `https://sleepercdn.com/avatars/${avatarId}`;
}

export function buildSleeperAvatarThumbUrl(avatarId: string | null | undefined): string | null {
  if (!avatarId) return null;
  return `https://sleepercdn.com/avatars/thumbs/${avatarId}`;
}
