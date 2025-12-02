// src/components/bracket/KeeperBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface KeeperBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const KEEPER_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Keeper Bowl',
    // Intentionally empty to mirror Champ/Toilet having a Round 1 column footprint
    items: [],
  },
  {
    title: 'Round 2',
    subtitle: 'Keeper Bowl',
    heightScale: 1.15,
    items: [
      { id: 'keeper_splashback1', slotId: 'keeper_splashback1', topPct: 0, centerOnPct: false },
      { id: 'keeper_splashback2', slotId: 'keeper_splashback2', topPct: 75, centerOnPct: true },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Placement',
    heightScale: 1.15,
    items: [
      { id: 'keeper_5th_6th', slotId: 'keeper_5th_6th', topPct: 37, centerOnPct: true },
      { id: 'keeper_7th_8th', slotId: 'keeper_7th_8th', topPct: 85, centerOnPct: true },
    ],
  },
];

export const KeeperBracket: FC<KeeperBracketProps> = ({
  slots,
  teamsById,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={KEEPER_COLUMNS}
      slots={slots}
      teamsById={teamsById}
      highlightTeamId={highlightTeamId}
      mode={mode}
      columnHeightClass="min-h-[300px] md:min-h-[360px]"
      defaultHeightScale={1.15}
    />
  );
};
