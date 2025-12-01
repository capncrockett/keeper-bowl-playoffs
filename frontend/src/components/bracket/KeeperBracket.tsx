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
    title: 'Round 2',
    subtitle: 'Keeper Bowl',
    items: [
      { id: 'keeper_splashback1', slotId: 'keeper_splashback1', topPct: 25 },
      { id: 'keeper_splashback2', slotId: 'keeper_splashback2', topPct: 75 },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Placement',
    items: [
      { id: 'keeper_5th_6th', slotId: 'keeper_5th_6th', topPct: 25 },
      { id: 'keeper_7th_8th', slotId: 'keeper_7th_8th', topPct: 75 },
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
      columnHeightClass="min-h-[720px] md:min-h-[880px]"
    />
  );
};
