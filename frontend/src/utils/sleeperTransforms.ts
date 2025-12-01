// frontend/src/utils/sleeperTransforms.ts

import {
  buildSleeperAvatarUrl,
  type SleeperRoster,
  type SleeperUser,
  type SleeperMatchup,
  type SleeperNFLState,
  type SleeperPlayer,
  type SleeperLeague,
} from '../api/sleeper';
import type { Team, PairedMatchup, LiveMatchData, SeasonState } from '../models/fantasy';
import { countFinishedPlayers } from './playerGameStatus';

// --- Merge rosters + users → Team[] ---

export function mergeRostersAndUsersToTeams(
  rosters: SleeperRoster[],
  users: SleeperUser[],
  league?: SleeperLeague,
): Team[] {
  const usersById = new Map<string, SleeperUser>(users.map((u) => [u.user_id, u]));
  const divisionNameById = new Map<number, string>();
  const divisionAvatarById = new Map<number, string | null>();

  const resolveAvatarUrl = (avatarId?: string | null): string | null => {
    if (!avatarId) return null;
    return avatarId.startsWith('http') ? avatarId : buildSleeperAvatarUrl(avatarId);
  };

  if (league?.metadata) {
    for (const [key, value] of Object.entries(league.metadata)) {
      if (typeof value !== 'string') continue;
      const nameMatch = key.match(/^division_(\d+)$/);
      const avatarMatch = key.match(/^division_(\d+)_avatar$/) ?? key.match(/^division_avatar_(\d+)$/);

      if (nameMatch) {
        const id = Number(nameMatch[1]);
        if (!Number.isNaN(id)) {
          divisionNameById.set(id, value);
        }
        continue;
      }

      if (avatarMatch) {
        const id = Number(avatarMatch[1]);
        if (!Number.isNaN(id)) {
          const url = value.startsWith('http') ? value : buildSleeperAvatarUrl(value);
          divisionAvatarById.set(id, url);
        }
      }
    }
  }

  const teams: Team[] = rosters.map((roster) => {
    const user = usersById.get(roster.owner_id);
    const divisionIdRaw =
      roster.division_id ??
      roster.division ??
      (roster.settings as { division_id?: number; division?: number }).division_id ??
      (roster.settings as { division?: number }).division ??
      null;
    const divisionId =
      divisionIdRaw === null || divisionIdRaw === undefined
        ? null
        : Number.isNaN(Number(divisionIdRaw))
          ? null
          : Number(divisionIdRaw);

    const wins = roster.settings.wins ?? 0;
    const losses = roster.settings.losses ?? 0;
    const ties = roster.settings.ties ?? 0;

    const pointsForRaw = roster.settings.fpts ?? 0;
    const pointsForDecimal = (roster.settings.fpts_decimal ?? 0) / 100;
    const pointsAgainstRaw = roster.settings.fpts_against ?? 0;
    const pointsAgainstDecimal = (roster.settings.fpts_against_decimal ?? 0) / 100;

    const pointsFor = pointsForRaw + pointsForDecimal;
    const pointsAgainst = pointsAgainstRaw + pointsAgainstDecimal;

    const teamName =
      roster.metadata?.team_name ??
      user?.metadata?.team_name ??
      user?.display_name ??
      `Team ${roster.roster_id.toString()}`;

    const userAvatarUrl = buildSleeperAvatarUrl(user?.avatar ?? null);
    const teamAvatarUrl =
      resolveAvatarUrl((roster.metadata?.avatar as string | undefined) ?? null) ??
      resolveAvatarUrl((roster.metadata?.team_avatar as string | undefined) ?? null) ??
      resolveAvatarUrl((user?.metadata?.avatar as string | undefined) ?? null) ??
      resolveAvatarUrl((user?.metadata?.team_avatar as string | undefined) ?? null) ??
      userAvatarUrl ??
      null;

    return {
      teamName,
      ownerDisplayName: user?.display_name ?? 'Unknown Manager',
      teamAvatarUrl,
      userAvatarUrl,
      sleeperRosterId: roster.roster_id,
      sleeperUserId: roster.owner_id,
      divisionId,
      divisionName: divisionId ? divisionNameById.get(divisionId) ?? `Division ${divisionId}` : null,
      divisionAvatarUrl: divisionId ? divisionAvatarById.get(divisionId) ?? null : null,
      record: { wins, losses, ties },
      pointsFor,
      pointsAgainst,
      rank: 0, // filled in by computeStandings
    };
  });

  // compute ranks now (mutates cloned array, then returns new with ranks)
  const ranked = computeStandings(teams);
  return ranked;
}

// --- Pair matchups by matchup_id ---

export function pairMatchups(
  week: number,
  matchups: SleeperMatchup[],
  playersById?: Record<string, SleeperPlayer>,
  teamGameStatus?: Map<string, boolean>,
): PairedMatchup[] {
  const map = new Map<number, SleeperMatchup[]>();

  for (const m of matchups) {
    const existing = map.get(m.matchup_id);
    if (existing) {
      existing.push(m);
    } else {
      map.set(m.matchup_id, [m]);
    }
  }

  const paired: PairedMatchup[] = [];

  for (const [matchupId, entries] of map.entries()) {
    if (entries.length === 0) continue;

    const [a, b] = entries;

    // Count finished players if data is available
    const canCountFinished = playersById && teamGameStatus;
    const finishedA = canCountFinished
      ? countFinishedPlayers(a.starters, playersById, teamGameStatus)
      : { total: a.starters?.length ?? 0, finished: a.starters?.length ?? 0 };

    if (!b) {
      // bye / incomplete data - treat second side as null
      paired.push({
        matchupId,
        week,
        rosterIdA: a.roster_id,
        rosterIdB: null,
        pointsA: a.points ?? 0,
        pointsB: 0,
        startersA: finishedA.total,
        startersB: 0,
        playersFinishedA: finishedA.finished,
        playersFinishedB: 0,
      });
      continue;
    }

    const finishedB = canCountFinished
      ? countFinishedPlayers(b.starters, playersById, teamGameStatus)
      : { total: b.starters?.length ?? 0, finished: b.starters?.length ?? 0 };

    paired.push({
      matchupId,
      week,
      rosterIdA: a.roster_id,
      rosterIdB: b.roster_id,
      pointsA: a.points ?? 0,
      pointsB: b.points ?? 0,
      startersA: finishedA.total,
      startersB: finishedB.total,
      playersFinishedA: finishedA.finished,
      playersFinishedB: finishedB.finished,
    });
  }

  return paired;
}

// --- Build LiveMatchData from a paired matchup ---

export function buildLiveMatchData(paired: PairedMatchup): LiveMatchData {
  return {
    teamIdA: paired.rosterIdA,
    teamIdB: paired.rosterIdB,
    pointsA: paired.pointsA,
    pointsB: paired.pointsB,
    startersA: paired.startersA,
    startersB: paired.startersB,
    playersFinishedA: paired.playersFinishedA,
    playersFinishedB: paired.playersFinishedB,
    week: paired.week,
  };
}

// --- Season state derivation ---

export function mapNFLStateToSeasonState(nfl: SleeperNFLState): SeasonState {
  return {
    week: nfl.week,
    displayWeek: nfl.display_week,
    season: nfl.season,
    seasonType: nfl.season_type,
    leagueSeason: nfl.league_season,
  };
}

// --- Standings + seeding ---

export function computeStandings(teams: Team[]): Team[] {
  const sorted = [...teams].sort((a, b) => {
    // primary: wins desc
    if (b.record.wins !== a.record.wins) {
      return b.record.wins - a.record.wins;
    }

    // secondary: pointsFor desc
    if (b.pointsFor !== a.pointsFor) {
      return b.pointsFor - a.pointsFor;
    }

    // tertiary: losses asc
    if (a.record.losses !== b.record.losses) {
      return a.record.losses - b.record.losses;
    }

    // final: ties asc
    return a.record.ties - b.record.ties;
  });

  return sorted.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));
}

export function computeSeeds(teams: Team[]): Team[] {
  const standings = computeStandings(teams);

  return standings.map((team, index) => ({
    ...team,
    seed: index + 1,
  }));
}
