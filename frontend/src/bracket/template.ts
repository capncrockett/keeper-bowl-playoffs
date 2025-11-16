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
    rewardTitle: 'CHAMPION!!!',
    rewardText:
      'CHAMPION!!! + The BELT! + Payout. Photos with the belt on its travels are required by law.',
  },
  {
    id: 'champ_3rd',
    bracketId: 'champ',
    round: 'champ_misc',
    label: '3rd Place Game',
    positions: [null, null],
    rewardTitle: '3rd / 4th',
    rewardText:
      'W = 3rd (1x buy-in). L = 4th. Next season is free for one of you. The other, at least you had a shot.',
  },

  //
  // KEEPER BOWL
  //
  {
    id: 'keeper_floater1',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Floater 1 (Champ loser top)',
    positions: [null, null], // loser champ_r2_g1 + Toilet winner top
  },
  {
    id: 'keeper_splashback1',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Splash Back 1',
    positions: [null, null],
    rewardTitle: '5th Place',
    rewardText:
      'W = 5th. Barring a shot at glory this is pretty sweet. Hope you held on to some good ones. 1 extra keeper next season.',
  },
  {
    id: 'keeper_floater2',
    bracketId: 'keeper',
    round: 'keeper_main',
    label: 'Floater 2 (Champ loser bottom)',
    positions: [null, null],
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
    rewardText: 'W = 5th with an extra keeper. L = 6th. So close, no matter how far.',
  },
  {
    id: 'keeper_7th_8th',
    bracketId: 'keeper',
    round: 'keeper_misc',
    label: '7th / 8th Game',
    positions: [null, null],
    rewardTitle: '7th / 8th',
    rewardText: "W = 7th | L = 8th. Could've been better. Could've been worse.",
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
    rewardTitle: 'Poop King!!!',
    rewardText: "W = 12th. You're the winner of the poopiest. 1.01 + 50 FAAB next season.",
  },
  {
    id: 'toilet_9th_10th',
    bracketId: 'toilet',
    round: 'toilet_misc',
    label: '9th / 10th Game',
    positions: [null, null],
    rewardTitle: '9th / 10th / 11th',
    rewardText:
      "W = 10th (at least you're not the worst). L = 9th AKA ^^^ (Yaaaa. You're the actual poop. King!) 11th took a shart for 1.02.",
  },
];
