// src/components/bracket/ToiletBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketConnector, BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface ToiletBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const TOILET_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Week 15',
    cells: [
      { id: 'toilet_bye1', slotId: 'toilet_r2_g1' },
      { id: 'toilet_r1_g1', slotId: 'toilet_r1_g1' },
      { id: 'toilet_r1_g2', slotId: 'toilet_r1_g2' },
      { id: 'toilet_bye2', slotId: 'toilet_r2_g2' },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    cells: [
      { id: 'toilet_r2_g1', slotId: 'toilet_r2_g1', row: 2 },
      { id: 'toilet_r2_g2', slotId: 'toilet_r2_g2', row: 3 },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    cells: [
      { id: 'toilet_finals', slotId: 'toilet_finals', row: 3 },
      { id: 'toilet_9th_10th', slotId: 'toilet_9th_10th', row: 4 },
    ],
  },
];

const TOILET_CONNECTORS: BracketConnector[] = [
  { fromId: 'toilet_r1_g1', toId: 'toilet_r2_g1' },
  { fromId: 'toilet_r1_g2', toId: 'toilet_r2_g2' },
  { fromId: 'toilet_r2_g1', toId: 'toilet_finals' },
  { fromId: 'toilet_r2_g2', toId: 'toilet_finals' },
];

export const ToiletBracket: FC<ToiletBracketProps> = ({
  slots,
  teamsById,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={TOILET_COLUMNS}
      connectors={TOILET_CONNECTORS}
      slots={slots}
      teamsById={teamsById}
      highlightTeamId={highlightTeamId}
      mode={mode}
    />
  );
};
