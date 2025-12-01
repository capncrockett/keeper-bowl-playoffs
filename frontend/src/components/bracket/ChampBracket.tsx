// src/components/bracket/ChampBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketConnector, BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface ChampBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const CHAMP_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Week 15',
    cells: [
      { id: 'champ_bye1', slotId: 'champ_r2_g1' },
      { id: 'champ_r1_g1', slotId: 'champ_r1_g1' },
      { id: 'champ_r1_g2', slotId: 'champ_r1_g2' },
      { id: 'champ_bye2', slotId: 'champ_r2_g2' },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    cells: [
      { id: 'champ_r2_g1', slotId: 'champ_r2_g1', row: 2 },
      { id: 'champ_r2_g2', slotId: 'champ_r2_g2', row: 3 },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    cells: [
      { id: 'champ_finals', slotId: 'champ_finals', row: 3 },
      { id: 'champ_3rd', slotId: 'champ_3rd', row: 4 },
    ],
  },
];

const CHAMP_CONNECTORS: BracketConnector[] = [
  { fromId: 'champ_r1_g1', toId: 'champ_r2_g1' },
  { fromId: 'champ_r1_g2', toId: 'champ_r2_g2' },
  { fromId: 'champ_r2_g1', toId: 'champ_finals' },
  { fromId: 'champ_r2_g2', toId: 'champ_finals' },
];

export const ChampBracket: FC<ChampBracketProps> = ({
  slots,
  teamsById,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={CHAMP_COLUMNS}
      connectors={CHAMP_CONNECTORS}
      slots={slots}
      teamsById={teamsById}
      highlightTeamId={highlightTeamId}
      mode={mode}
    />
  );
};
