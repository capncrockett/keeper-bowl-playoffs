// src/components/bracket/ChampBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketLayoutColumn } from './BracketGrid';
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
    items: [
      { id: 'champ_bye1', slotId: 'champ_r2_g1', topPct: 1, maskOppIndex: 1 },
      { id: 'champ_r1_g1', slotId: 'champ_r1_g1', topPct: 25 },
      { id: 'champ_r1_g2', slotId: 'champ_r1_g2', topPct: 50 },
      { id: 'champ_bye2', slotId: 'champ_r2_g2', topPct: 75, maskOppIndex: 1 },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    items: [
      { id: 'champ_r2_g1', slotId: 'champ_r2_g1', topPct: 12.5 },
      { id: 'champ_r2_g2', slotId: 'champ_r2_g2', topPct: 62.5 },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    items: [
      { id: 'champ_finals', slotId: 'champ_finals', topPct: 37.5 },
      { id: 'champ_3rd', slotId: 'champ_3rd', topPct: 83 },
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
      columnHeightClass="min-h-[600px] md:min-h-[760px]"
    />
  );
};
