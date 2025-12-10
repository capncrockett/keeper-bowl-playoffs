// src/components/bracket/ChampBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketColumnDef } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface ChampBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const CHAMP_COLUMNS: BracketColumnDef[] = [
  {
    id: 'champ_round1',
    title: 'Round 1',
    subtitle: 'Week 15',
    items: [
      {
        id: 'champ_bye1',
        slotId: 'champ_r2_g1',
        kind: 'bye',
        titleOverride: 'BYE',
        maskOppIndex: 1,
      },
      { id: 'champ_r1_g1', slotId: 'champ_r1_g1', kind: 'match' },
      {
        id: 'champ_bye2',
        slotId: 'champ_r2_g2',
        kind: 'bye',
        titleOverride: 'BYE',
        maskOppIndex: 1,
      },
      { id: 'champ_r1_g2', slotId: 'champ_r1_g2', kind: 'match' },
    ],
  },
  {
    id: 'champ_round2',
    title: 'Round 2',
    subtitle: 'Week 16',
    items: [
      { id: 'champ_r2_g1', slotId: 'champ_r2_g1', kind: 'match' },
      { id: 'champ_r2_g2', slotId: 'champ_r2_g2', kind: 'match' },
    ],
  },
  {
    id: 'champ_finals',
    title: 'Finals',
    subtitle: 'Week 17',
    items: [
      { id: 'champ_finals', slotId: 'champ_finals', kind: 'match' },
      { id: 'champ_3rd', slotId: 'champ_3rd', kind: 'match' },
    ],
  },
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
      slots={slots}
      teamsById={teamsById}
      highlightTeamId={highlightTeamId}
      mode={mode}
      columnHeightClass="min-h-[520px] md:min-h-[760px]"
    />
  );
};
