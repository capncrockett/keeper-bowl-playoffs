// src/bracket/types.ts

export type BracketId = 'champ' | 'keeper' | 'toilet';

export type BracketSlotId =
  // Champ
  | 'champ_r1_g1'
  | 'champ_r1_g2'
  | 'champ_r2_g1'
  | 'champ_r2_g2'
  | 'champ_finals'
  | 'champ_3rd'
  // Keeper
  | 'keeper_floater1'
  | 'keeper_floater2'
  | 'keeper_splashback1'
  | 'keeper_splashback2'
  | 'keeper_5th_6th'
  | 'keeper_7th_8th'
  // Toilet
  | 'toilet_r1_g1'
  | 'toilet_r1_g2'
  | 'toilet_r2_g1'
  | 'toilet_r2_g2'
  | 'toilet_finals'
  | 'toilet_9th_10th';

export type BracketRound =
  | 'champ_round_1'
  | 'champ_round_2'
  | 'champ_finals'
  | 'champ_misc'
  | 'keeper_main'
  | 'keeper_misc'
  | 'toilet_round_1'
  | 'toilet_round_2'
  | 'toilet_finals'
  | 'toilet_misc';

export interface BracketTeamRef {
  /** Final seed number 1-12 (from computeSeeds). */
  seed?: number;
  /** Canonical ID for the team - we’ll use Team.sleeperRosterId. */
  teamId?: number;
  /** Marks a bye position where no team actually plays. */
  isBye?: boolean;
}

export interface BracketSlot {
  id: BracketSlotId;
  bracketId: BracketId;
  round: BracketRound;
  /** Human-readable label: "Champ R1 G1 (4 vs 5)", "Floater 1", etc. */
  label: string;
  /** Two sides of the matchup: top/left and bottom/right. */
  positions: [BracketTeamRef | null, BracketTeamRef | null];
  /** Week of the NFL season this game is played, if we want to show it. */
  sleeperWeek?: number;
  /** Reward metadata for Reward Mode. */
  rewardTitle?: string;
  rewardText?: string;
}

export interface BracketRoutingRule {
  fromSlotId: BracketSlotId;
  winnerGoesTo?: {
    slotId: BracketSlotId;
    positionIndex: 0 | 1; // 0 = top/left, 1 = bottom/right
  };
  loserGoesTo?: {
    slotId: BracketSlotId;
    positionIndex: 0 | 1;
  };
}
