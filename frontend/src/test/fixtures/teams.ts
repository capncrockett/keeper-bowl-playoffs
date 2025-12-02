import type { Team } from '../../models/fantasy';

export function buildTeam(overrides: Partial<Team> = {}): Team {
  return {
    teamName: overrides.teamName ?? 'Team Alpha',
    ownerDisplayName: overrides.ownerDisplayName ?? 'Owner One',
    teamAvatarUrl: overrides.teamAvatarUrl ?? null,
    userAvatarUrl: overrides.userAvatarUrl ?? null,
    sleeperRosterId: overrides.sleeperRosterId ?? 1,
    sleeperUserId: overrides.sleeperUserId ?? 'user-1',
    divisionId: overrides.divisionId ?? null,
    divisionName: overrides.divisionName ?? null,
    divisionAvatarUrl: overrides.divisionAvatarUrl ?? null,
    record: overrides.record ?? { wins: 0, losses: 0, ties: 0 },
    pointsFor: overrides.pointsFor ?? 100,
    pointsAgainst: overrides.pointsAgainst ?? 90,
    rank: overrides.rank ?? 1,
    seed: overrides.seed,
  };
}

export const mockTeams: Team[] = Array.from({ length: 12 }, (_, index) =>
  buildTeam({
    teamName: `Team ${index + 1}`,
    ownerDisplayName: `Owner ${index + 1}`,
    sleeperRosterId: index + 1,
    sleeperUserId: `user-${index + 1}`,
    seed: index + 1,
    rank: index + 1,
  }),
);
