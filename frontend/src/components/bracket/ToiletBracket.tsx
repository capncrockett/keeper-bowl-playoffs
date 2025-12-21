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
    items: [
      { id: 'toilet_bye1', slotId: 'toilet_r2_g1', topPct: 1, maskOppIndex: 1, titleOverride: 'BYE' },
      { id: 'toilet_r1_g1', slotId: 'toilet_r1_g1', topPct: 25 },
      { id: 'toilet_bye2', slotId: 'toilet_r2_g2', topPct: 50, maskOppIndex: 1, titleOverride: 'BYE' },
      { id: 'toilet_r1_g2', slotId: 'toilet_r1_g2', topPct: 75 },
    ],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    items: [
      { id: 'toilet_r2_g1', slotId: 'toilet_r2_g1', topPct: 12.5 },
      { id: 'toilet_r2_g2', slotId: 'toilet_r2_g2', topPct: 62.5 },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    items: [
      { id: 'toilet_finals', slotId: 'toilet_finals', topPct: 37.5 },
      { id: 'toilet_9th_10th', slotId: 'toilet_9th_10th', topPct: 87.5 },
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
