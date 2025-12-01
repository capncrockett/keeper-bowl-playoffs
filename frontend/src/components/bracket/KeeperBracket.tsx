// src/components/bracket/KeeperBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketConnector, BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface KeeperBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const KEEPER_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Keeper Bowl',
    cells: [
      { id: 'keeper_floater1', slotId: 'keeper_floater1', row: 1 },
      { id: 'keeper_floater2', slotId: 'keeper_floater2', row: 2 },
      null,
      { id: 'keeper_splashback1', slotId: 'keeper_splashback1', row: 4 },
      { id: 'keeper_splashback2', slotId: 'keeper_splashback2', row: 5 },
    ],
  },
  {
    title: 'Placement',
    cells: [
      { id: 'keeper_5th_6th', slotId: 'keeper_5th_6th', row: 4 },
      { id: 'keeper_7th_8th', slotId: 'keeper_7th_8th', row: 5 },
    ],
  },
];

const KEEPER_CONNECTORS: BracketConnector[] = [
  { fromId: 'keeper_splashback1', toId: 'keeper_5th_6th' },
  { fromId: 'keeper_splashback2', toId: 'keeper_5th_6th' },
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
      connectors={KEEPER_CONNECTORS}
      slots={slots}
      teamsById={teamsById}
      highlightTeamId={highlightTeamId}
      mode={mode}
      rowHeightClass="auto-rows-[120px] md:auto-rows-[140px]"
    />
  );
};
