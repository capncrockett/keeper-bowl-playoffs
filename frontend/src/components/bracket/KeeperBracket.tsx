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

const renderKeeperInfoRow = (label: string) => (
  <div className="flex-1 max-w-full overflow-hidden min-w-0 flex items-center justify-center">
    <div className="text-[0.65rem] md:text-sm font-semibold text-base-content/90 leading-tight text-center">
      {label}
    </div>
  </div>
);

const KEEPER_COLUMNS: BracketLayoutColumn[] = [
  {
    title: 'Round 1',
    subtitle: 'Seeding',
    // Info cards explaining who drops into Keeper Round 2.
    itemsContainerClassName: 'justify-between',
    items: [
      {
        id: 'keeper_round1_matchup1',
        slotId: null,
        ghostContentClassName: 'flex h-full w-full flex-col divide-y divide-base-300',
        ghostContent: (
          <>
            {renderKeeperInfoRow('Floater 1')}
            {renderKeeperInfoRow('Splashback 1')}
          </>
        ),
      },
      {
        id: 'keeper_round1_matchup2',
        slotId: null,
        ghostContentClassName: 'flex h-full w-full flex-col divide-y divide-base-300',
        ghostContent: (
          <>
            {renderKeeperInfoRow('Floater 2')}
            {renderKeeperInfoRow('Splashback 2')}
          </>
        ),
      },
      {
        id: 'keeper_round1_spacer',
        slotId: null,
        itemClassName: 'outline outline-2 outline-pink-500/70',
      },
    ],
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
