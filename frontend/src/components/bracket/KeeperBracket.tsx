// src/components/bracket/KeeperBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketColumnDef } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface KeeperBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const KEEPER_COLUMNS: BracketColumnDef[] = [
  {
    id: 'keeper_round1',
    title: 'Round 1',
    subtitle: 'Keeper Bowl',
    // Intentionally empty to mirror Champ/Toilet having a Round 1 column footprint
    items: [],
  },
  {
    id: 'keeper_round2',
    title: 'Round 2',
    subtitle: 'Keeper Bowl',
    items: [
      { id: 'keeper_splashback1', slotId: 'keeper_splashback1', kind: 'match' },
      { id: 'keeper_splashback2', slotId: 'keeper_splashback2', kind: 'match' },
    ],
  },
  {
    id: 'keeper_finals',
    title: 'Finals',
    subtitle: 'Placement',
    items: [
      { id: 'keeper_5th_6th', slotId: 'keeper_5th_6th', kind: 'match' },
      { id: 'keeper_7th_8th', slotId: 'keeper_7th_8th', kind: 'match' },
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
      columnHeightClass="min-h-[260px] md:min-h-[340px]"
    />
  );
};
