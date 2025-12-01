// src/bracket/routingRules.ts

import type { BracketRoutingRule } from './types';

/**
 * Structural routing between bracket slots.
 *
 * This does NOT compute winners/losers; it just says:
 * "When we know who won fromSlotId, put them in this target slot/index."
 */
export const ROUTING_RULES: BracketRoutingRule[] = [
  //
  // CHAMP BOWL
  //

  // Round 1 -> Round 2 + Keeper
  {
    fromSlotId: 'champ_r1_g1',
    // Winner plays in Champ R2 G1 (vs seed 1) as the bottom slot
    winnerGoesTo: { slotId: 'champ_r2_g1', positionIndex: 1 },
    // Loser drops into Keeper Splashback 1 (as the Floater side)
    loserGoesTo: { slotId: 'keeper_splashback1', positionIndex: 0 },
  },
  {
    fromSlotId: 'champ_r1_g2',
    // Winner plays in Champ R2 G2 (vs seed 2) as the bottom slot
    winnerGoesTo: { slotId: 'champ_r2_g2', positionIndex: 1 },
    // Loser drops into Keeper Splashback 2 (as the Floater side)
    loserGoesTo: { slotId: 'keeper_splashback2', positionIndex: 0 },
  },

  // Round 2 -> Finals + 3rd place
  {
    fromSlotId: 'champ_r2_g1',
    // Winners to Championship (left side)
    winnerGoesTo: { slotId: 'champ_finals', positionIndex: 0 },
    // Losers to 3rd place game (left side)
    loserGoesTo: { slotId: 'champ_3rd', positionIndex: 0 },
  },
  {
    fromSlotId: 'champ_r2_g2',
    // Winners to Championship (right side)
    winnerGoesTo: { slotId: 'champ_finals', positionIndex: 1 },
    // Losers to 3rd place game (right side)
    loserGoesTo: { slotId: 'champ_3rd', positionIndex: 1 },
  },

  //
  // TOILET BOWL
  //

  // Round 1 -> Round 2 + Keeper
  // Winners jump up into Keeper Splashback; losers slide to face the bye seeds
  {
    fromSlotId: 'toilet_r1_g1',
    winnerGoesTo: { slotId: 'keeper_splashback1', positionIndex: 1 },
    loserGoesTo: { slotId: 'toilet_r2_g1', positionIndex: 1 },
  },
  // R1 G2 mirrors top side
  {
    fromSlotId: 'toilet_r1_g2',
    winnerGoesTo: { slotId: 'keeper_splashback2', positionIndex: 1 },
    loserGoesTo: { slotId: 'toilet_r2_g2', positionIndex: 1 },
  },

  // Round 2 -> Poop King final + 9th/10th game
  {
    fromSlotId: 'toilet_r2_g1',
    // Winners move to Poop King final
    winnerGoesTo: { slotId: 'toilet_finals', positionIndex: 0 },
    // Losers play in 9th/10th game
    loserGoesTo: { slotId: 'toilet_9th_10th', positionIndex: 0 },
  },
  {
    fromSlotId: 'toilet_r2_g2',
    winnerGoesTo: { slotId: 'toilet_finals', positionIndex: 1 },
    loserGoesTo: { slotId: 'toilet_9th_10th', positionIndex: 1 },
  },

  //
  // KEEPER BOWL
  //
  // Splashback -> 5th/6th
  {
    fromSlotId: 'keeper_splashback1',
    winnerGoesTo: { slotId: 'keeper_5th_6th', positionIndex: 0 },
    loserGoesTo: { slotId: 'keeper_7th_8th', positionIndex: 0 },
  },
  {
    fromSlotId: 'keeper_splashback2',
    winnerGoesTo: { slotId: 'keeper_5th_6th', positionIndex: 1 },
    loserGoesTo: { slotId: 'keeper_7th_8th', positionIndex: 1 },
  },
];
