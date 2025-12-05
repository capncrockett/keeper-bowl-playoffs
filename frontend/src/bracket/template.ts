// src/bracket/template.ts
import type { BracketSlot } from './types';

export const BRACKET_TEMPLATE: BracketSlot[] = [
  //
  // CHAMP BOWL
  //
  {
    id: 'champ_r1_g1',
    bracketId: 'champ',
    round: 'champ_round_1',
    label: 'Champ R1 G1 (4 vs 5)',
    positions: [{ seed: 4 }, { seed: 5 }],
  },
  {
    id: 'champ_r1_g2',
    bracketId: 'champ',
    round: 'champ_round_1',
    label: 'Champ R1 G2 (3 vs 6)',
    positions: [{ seed: 3 }, { seed: 6 }],
  },
  {
    id: 'champ_r2_g1',
    bracketId: 'champ',
    round: 'champ_round_2',
    label: 'Champ R2 G1 (1 vs winner R1 G1)',
    positions: [{ seed: 1 }, null],
  },
  {
    id: 'champ_r2_g2',
    bracketId: 'champ',
    round: 'champ_round_2',
    label: 'Champ R2 G2 (2 vs winner R1 G2)',
    positions: [{ seed: 2 }, null],
  },
  {
    id: 'champ_finals',
    bracketId: 'champ',
    round: 'champ_finals',
    label: 'Championship',
    positions: [null, null],
    rewardTitle: '1st / 2nd',
    rewardText: 'W = 1st | L = 2nd',
  },
  {
    id: 'champ_3rd',
    bracketId: 'champ',
    round: 'champ_misc',
    label: '3rd Place Game',
    positions: [null, null],
    rewardTitle: '3rd / 4th',
    rewardText: 'W = 3rd | L = 4th',
  },

  //
  // KEEPER BOWL
  //
  {
    id: 'keeper_floater1',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Floater 1 (Champ loser top)',
    positions: [null, null], // Champ Round 1 loser drops here (routed into Splashback 1)
  },
  {
    id: 'keeper_splashback1',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Splash Back 1',
    positions: [null, null],
  },
  {
    id: 'keeper_floater2',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Floater 2 (Champ loser bottom)',
    positions: [null, null], // Champ Round 1 loser drops here (routed into Splashback 2)
  },
  {
    id: 'keeper_splashback2',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Splash Back 2',
    positions: [null, null],
  },
  {
    id: 'keeper_5th_6th',
    bracketId: 'keeper',
    round: 'keeper_misc',
    label: '5th / 6th Game',
    positions: [null, null],
    rewardTitle: '5th / 6th',
    rewardText: 'W = 5th | L = 6th',
  },
  {
    id: 'keeper_7th_8th',
    bracketId: 'keeper',
    round: 'keeper_misc',
    label: '7th / 8th Game',
    positions: [null, null],
    rewardTitle: '7th / 8th',
    rewardText: 'W = 7th | L = 8th',
  },

  //
  // TOILET BOWL
  //
  {
    id: 'toilet_r1_g1',
    bracketId: 'toilet',
    round: 'toilet_round_1',
    label: 'Toilet R1 G1 (8 vs 9)',
    positions: [{ seed: 8 }, { seed: 9 }],
  },
  {
    id: 'toilet_r1_g2',
    bracketId: 'toilet',
    round: 'toilet_round_1',
    label: 'Toilet R1 G2 (7 vs 10)',
    positions: [{ seed: 7 }, { seed: 10 }],
  },
  {
    id: 'toilet_r2_g1',
    bracketId: 'toilet',
    round: 'toilet_round_2',
    label: 'Toilet R2 G1 (12 vs winner R1 G1)',
    positions: [{ seed: 12 }, null],
  },
  {
    id: 'toilet_r2_g2',
    bracketId: 'toilet',
    round: 'toilet_round_2',
    label: 'Toilet R2 G2 (11 vs winner R1 G2)',
    positions: [{ seed: 11 }, null],
  },
  {
    id: 'toilet_finals',
    bracketId: 'toilet',
    round: 'toilet_finals',
    label: 'Poop King Final',
    positions: [null, null],
    rewardTitle: 'Toilet King',
    rewardText: 'W = 12th (Toilet King) | L = 11th',
  },
  {
    id: 'toilet_9th_10th',
    bracketId: 'toilet',
    round: 'toilet_misc',
    label: '9th / 10th Game',
    positions: [null, null],
    rewardTitle: 'Poop King',
    rewardText: 'W = 10th | L = 9th (Poop King)',
  },
];
