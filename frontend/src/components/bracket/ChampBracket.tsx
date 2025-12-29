// src/components/bracket/ChampBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface ChampBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  byeWeekPointsByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const CHAMP_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Week 15',
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'champ_bye1',
        slotId: 'champ_r2_g1',
        maskOppIndex: 1,
        titleOverride: 'BYE',
        connectorToSlotId: 'champ_r2_g1',
      },
      { id: 'champ_r1_g1', slotId: 'champ_r1_g1' },
      {
        id: 'champ_bye2',
        slotId: 'champ_r2_g2',
        maskOppIndex: 1,
        titleOverride: 'BYE',
        connectorToSlotId: 'champ_r2_g2',
      },
      { id: 'champ_r1_g2', slotId: 'champ_r1_g2' },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    itemsContainerClassName: 'justify-around',
    items: [
      { id: 'champ_r2_g1', slotId: 'champ_r2_g1' },
      { id: 'champ_r2_g2', slotId: 'champ_r2_g2' },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'champ_finals_spacer',
        slotId: null,
      },
      { id: 'champ_finals', slotId: 'champ_finals' },
      { id: 'champ_3rd', slotId: 'champ_3rd' },
    ],
  },
];

export const ChampBracket: FC<ChampBracketProps> = ({
  slots,
  teamsById,
  byeWeekPointsByTeamId,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={CHAMP_COLUMNS}
      slots={slots}
      teamsById={teamsById}
      scoreOverridesByTeamId={byeWeekPointsByTeamId}
      highlightTeamId={highlightTeamId}
      mode={mode}
      columnHeightClass="min-h-[600px] md:min-h-[760px]"
    />
  );
};
