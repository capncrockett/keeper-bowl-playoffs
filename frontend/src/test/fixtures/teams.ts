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

export const mockTeams: Team[] = Array.from({ length: 12 }, (_, index) => {
  const label = String(index + 1);
  const rosterId = index + 1;

  return buildTeam({
    teamName: `Team ${label}`,
    ownerDisplayName: `Owner ${label}`,
    sleeperRosterId: rosterId,
    sleeperUserId: `user-${label}`,
    seed: rosterId,
    rank: rosterId,
  });
});
