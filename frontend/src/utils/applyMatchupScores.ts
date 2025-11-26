// frontend/src/utils/applyMatchupScores.ts

import type { SleeperMatchup } from '../api/sleeper';
import type { BracketSlot } from '../bracket/types';

/**
 * Applies matchup scores (current points and projected points) to bracket slots.
 * 
 * For each bracket slot, finds the corresponding matchup data and updates
 * the positions with currentPoints and projectedPoints.
 *
 * @param slots - Array of bracket slots
 * @param matchups - Array of Sleeper matchup data for the week
 * @returns New array of bracket slots with score data applied
 */
export function applyMatchupScoresToBracket(
  slots: BracketSlot[],
  matchups: SleeperMatchup[],
): BracketSlot[] {
  // Build a map of roster_id -> matchup data
  const matchupByRosterId = new Map<number, SleeperMatchup>();
  matchups.forEach((m) => {
    matchupByRosterId.set(m.roster_id, m);
  });

  return slots.map((slot) => {
    // Clone the slot with updated positions
    const newPositions = slot.positions.map((pos) => {
      if (!pos || !pos.teamId) return pos;

      const matchup = matchupByRosterId.get(pos.teamId);
      if (!matchup) return pos;

      // For projections, we could calculate average or use starter projections
      // Sleeper doesn't provide projections directly in matchups endpoint
      // For now, we'll just use current points
      // TODO: Add player projections if needed
      
      return {
        ...pos,
        currentPoints: matchup.points ?? 0,
        // projectedPoints would need to come from player projections API
        // For now, leaving it undefined
      };
    }) as typeof slot.positions;

    return {
      ...slot,
      positions: newPositions,
    };
  });
}
