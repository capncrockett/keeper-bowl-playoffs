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
    // Loser drops to Keeper Floater 1
    loserGoesTo: { slotId: 'keeper_floater1', positionIndex: 0 },
  },
  {
    fromSlotId: 'champ_r1_g2',
    // Winner plays in Champ R2 G2 (vs seed 2) as the bottom slot
    winnerGoesTo: { slotId: 'champ_r2_g2', positionIndex: 1 },
    // Loser drops to Keeper Floater 2
    loserGoesTo: { slotId: 'keeper_floater2', positionIndex: 0 },
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

  // Round 1 -> Round 2
  // R1 G1 winner faces seed 12
  {
    fromSlotId: 'toilet_r1_g1',
    winnerGoesTo: { slotId: 'toilet_r2_g1', positionIndex: 1 },
    // R1 losers effectively fall toward 11th/12th via reward logic;
    // they don't play another explicit game.
  },
  // R1 G2 winner faces seed 11
  {
    fromSlotId: 'toilet_r1_g2',
    winnerGoesTo: { slotId: 'toilet_r2_g2', positionIndex: 1 },
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
  // Keeper flow depends a bit on how we finalize the Excel logic,
  // but structurally we know:
  // - Losers of Champ R1 land in keeper_floater1/2 (see rules above)
  // - Winners from those Keeper games end up in 5th/6th,
  //   and the others in 7th/8th.
  //
  // Floater -> Splashback
  {
    fromSlotId: 'keeper_floater1',
    winnerGoesTo: { slotId: 'keeper_splashback1', positionIndex: 0 },
    loserGoesTo: { slotId: 'keeper_7th_8th', positionIndex: 0 },
  },
  {
    fromSlotId: 'keeper_floater2',
    winnerGoesTo: { slotId: 'keeper_splashback2', positionIndex: 0 },
    loserGoesTo: { slotId: 'keeper_7th_8th', positionIndex: 1 },
  },

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
