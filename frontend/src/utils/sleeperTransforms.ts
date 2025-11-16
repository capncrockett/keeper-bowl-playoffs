// frontend/src/utils/sleeperTransforms.ts

import {
  buildSleeperAvatarUrl,
  type SleeperRoster,
  type SleeperUser,
  type SleeperMatchup,
  type SleeperNFLState,
} from '../api/sleeper';
import type { Team, PairedMatchup, LiveMatchData, SeasonState } from '../models/fantasy';

// --- Merge rosters + users → Team[] ---

export function mergeRostersAndUsersToTeams(
  rosters: SleeperRoster[],
  users: SleeperUser[],
): Team[] {
  const usersById = new Map<string, SleeperUser>(users.map((u) => [u.user_id, u]));

  const teams: Team[] = rosters.map((roster) => {
    const user = usersById.get(roster.owner_id);

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
      user?.metadata?.team_name ?? user?.display_name ?? `Team ${roster.roster_id.toString()}`;

    const avatarUrl = buildSleeperAvatarUrl(user?.avatar ?? null);

    return {
      teamName,
      ownerDisplayName: user?.display_name ?? 'Unknown Manager',
      avatarUrl,
      sleeperRosterId: roster.roster_id,
      sleeperUserId: roster.owner_id,
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

export function pairMatchups(week: number, matchups: SleeperMatchup[]): PairedMatchup[] {
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

    if (!b) {
      // bye / incomplete data – treat second side as null
      paired.push({
        matchupId,
        week,
        rosterIdA: a.roster_id,
        rosterIdB: null,
        pointsA: a.points ?? 0,
        pointsB: 0,
      });
      continue;
    }

    paired.push({
      matchupId,
      week,
      rosterIdA: a.roster_id,
      rosterIdB: b.roster_id,
      pointsA: a.points ?? 0,
      pointsB: b.points ?? 0,
    });
  }

  return paired;
}

// --- Build LiveMatchData from a paired matchup ---
// NOTE: Sleeper /matchups doesn’t include projections, so we use
// current points as a naive “projection” for now.

export function buildLiveMatchData(paired: PairedMatchup): LiveMatchData {
  const projectedA = paired.pointsA;
  const projectedB = paired.pointsB;

  const totalProjected = projectedA + projectedB;
  let winProbA = 0.5;
  let winProbB = 0.5;

  if (totalProjected > 0) {
    winProbA = projectedA / totalProjected;
    winProbB = projectedB / totalProjected;
  }

  return {
    teamIdA: paired.rosterIdA,
    teamIdB: paired.rosterIdB,
    pointsA: paired.pointsA,
    pointsB: paired.pointsB,
    projectedA,
    projectedB,
    winProbA,
    winProbB,
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
