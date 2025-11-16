// src/bracket/seedAssignment.ts
import type { Team } from '../models/fantasy';
import type { BracketSlot } from './types';
import { BRACKET_TEMPLATE } from './template';

/**
 * Given seeded teams, return a new array of BracketSlot where any position
 * with a `seed` also has a `teamId` wired up to that Team's sleeperRosterId.
 */
export function assignSeedsToBracketSlots(
  teams: Team[],
  template: BracketSlot[] = BRACKET_TEMPLATE,
): BracketSlot[] {
  const teamBySeed = new Map<number, Team>();

  teams.forEach((team) => {
    if (team.seed != null) {
      teamBySeed.set(team.seed, team);
    }
  });

  return template.map((slot) => {
    const positions = slot.positions.map((pos) => {
      if (!pos || pos.seed == null) return pos;

      const team = teamBySeed.get(pos.seed);
      if (!team) return pos;

      return {
        ...pos,
        teamId: team.sleeperRosterId,
      };
    }) as typeof slot.positions;

    return {
      ...slot,
      positions,
    };
  });
}
