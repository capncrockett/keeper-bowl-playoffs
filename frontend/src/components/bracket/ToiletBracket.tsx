// src/components/bracket/ToiletBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface ToiletBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  byeWeekPointsByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const TOILET_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Week 15',
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'toilet_bye1',
        slotId: 'toilet_r2_g1',
        maskOppIndex: 1,
        titleOverride: 'BYE',
      },
      { id: 'toilet_r1_g1', slotId: 'toilet_r1_g1' },
      {
        id: 'toilet_bye2',
        slotId: 'toilet_r2_g2',
        maskOppIndex: 1,
        titleOverride: 'BYE',
      },
      { id: 'toilet_r1_g2', slotId: 'toilet_r1_g2' },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    itemsContainerClassName: 'justify-around',
    items: [
      { id: 'toilet_r2_g1', slotId: 'toilet_r2_g1' },
      { id: 'toilet_r2_g2', slotId: 'toilet_r2_g2' },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'toilet_finals_spacer',
        slotId: null,
        itemClassName: 'outline outline-2 outline-pink-500/70',
      },
      { id: 'toilet_finals', slotId: 'toilet_finals' },
      { id: 'toilet_9th_10th', slotId: 'toilet_9th_10th' },
    ],
  },
];

export const ToiletBracket: FC<ToiletBracketProps> = ({
  slots,
  teamsById,
  byeWeekPointsByTeamId,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={TOILET_COLUMNS}
      slots={slots}
      teamsById={teamsById}
      scoreOverridesByTeamId={byeWeekPointsByTeamId}
      highlightTeamId={highlightTeamId}
      mode={mode}
      columnHeightClass="min-h-[600px] md:min-h-[760px]"
    />
  );
};
