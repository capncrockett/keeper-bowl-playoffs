// src/components/bracket/KeeperBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import type { BracketLayoutColumn } from './BracketGrid';
import { BracketGrid } from './BracketGrid';

interface KeeperBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  byeWeekPointsByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

const KEEPER_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Seeding',
    // Intentionally empty to mirror Champ/Toilet having a Round 1 column footprint
    items: [],
  },
  {
    title: 'Round 2',
    subtitle: 'Week 16',
    itemsContainerClassName: 'justify-between',
    items: [
      { id: 'keeper_splashback1', slotId: 'keeper_splashback1' },
      { id: 'keeper_splashback2', slotId: 'keeper_splashback2' },
      {
        id: 'keeper_round2_spacer',
        slotId: null,
        itemClassName: 'outline outline-2 outline-pink-500/70',
      },
    ],
  },
  {
    title: 'Finals',
    subtitle: 'Week 17',
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'keeper_finals_spacer_top',
        slotId: null,
        ghostBodyClassName: 'h-[65px] md:h-[75px]',
        itemClassName: 'outline outline-2 outline-pink-500/70',
      },
      { id: 'keeper_5th_6th', slotId: 'keeper_5th_6th' },
      {
        id: 'keeper_finals_spacer',
        slotId: null,
        ghostBodyClassName: 'h-[85px] md:h-[100px]',
        itemClassName: 'outline outline-2 outline-pink-500/70',
      },
      { id: 'keeper_7th_8th', slotId: 'keeper_7th_8th' },
    ],
  },
];

export const KeeperBracket: FC<KeeperBracketProps> = ({
  slots,
  teamsById,
  byeWeekPointsByTeamId,
  highlightTeamId,
  mode,
}) => {
  return (
    <BracketGrid
      columns={KEEPER_COLUMNS}
      slots={slots}
      teamsById={teamsById}
      scoreOverridesByTeamId={byeWeekPointsByTeamId}
      highlightTeamId={highlightTeamId}
      mode={mode}
      columnHeightClass="min-h-[300px] md:min-h-[360px]"
    />
  );
};
