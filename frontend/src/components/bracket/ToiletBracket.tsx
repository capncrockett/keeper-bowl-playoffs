// src/components/bracket/ToiletBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketColumnDef } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface ToiletBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  byeWeekPointsByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const TOILET_COLUMNS: BracketColumnDef[] = [
  {
    id: 'toilet_round1',
    title: 'Round 1',
    subtitle: 'Week 15',
    items: [
      {
        id: 'toilet_bye1',
        slotId: 'toilet_r2_g1',
        kind: 'bye',
        titleOverride: 'BYE',
        maskOppIndex: 1,
      },
      { id: 'toilet_r1_g1', slotId: 'toilet_r1_g1', kind: 'match' },
      {
        id: 'toilet_bye2',
        slotId: 'toilet_r2_g2',
        kind: 'bye',
        titleOverride: 'BYE',
        maskOppIndex: 1,
      },
      { id: 'toilet_r1_g2', slotId: 'toilet_r1_g2', kind: 'match' },
    ],
  },
  {
    id: 'toilet_round2',
    title: 'Round 2',
    subtitle: 'Week 16',
    items: [
      { id: 'toilet_r2_g1', slotId: 'toilet_r2_g1', kind: 'match' },
      { id: 'toilet_r2_g2', slotId: 'toilet_r2_g2', kind: 'match' },
    ],
  },
  {
    id: 'toilet_finals',
    title: 'Finals',
    subtitle: 'Week 17',
    items: [
      { id: 'toilet_finals', slotId: 'toilet_finals', kind: 'match' },
      { id: 'toilet_9th_10th', slotId: 'toilet_9th_10th', kind: 'match' },
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
      columnHeightClass="min-h-[520px] md:min-h-[760px]"
    />
  );
};
