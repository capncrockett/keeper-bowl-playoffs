// src/components/bracket/Bracket.tsx

import type { FC } from 'react';
import type { BracketSlot, BracketSlotId } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketColumn } from './BracketColumn';
import { ChampBracket } from './ChampBracket';

interface BracketProps {
  slots: BracketSlot[];
  teams: Team[];
}

// non-Champ placement by stage (stacked)
const PLACEMENT_COLUMNS: {
  id: string;
  title: string;
  slotIds: BracketSlotId[];
}[] = [
  {
    id: 'stage_keeper_toilet_r2',
    title: 'Round 2 – Keeper & Toilet',
    slotIds: ['keeper_floater1', 'keeper_floater2', 'toilet_r2_g1', 'toilet_r2_g2'],
  },
  {
    id: 'stage_keeper_toilet_finals',
    title: 'Finals – Keeper & Toilet',
    slotIds: [
      'keeper_splashback1',
      'keeper_splashback2',
      'keeper_5th_6th',
      'keeper_7th_8th',
      'toilet_finals',
      'toilet_9th_10th',
    ],
  },
];

export const Bracket: FC<BracketProps> = ({ slots, teams }) => {
  const teamsById = new Map<number, Team>();
  teams.forEach((t) => teamsById.set(t.sleeperRosterId, t));

  const champSlots = slots.filter((s) => s.bracketId === 'champ');
  const placementSlots = slots.filter((s) => s.bracketId !== 'champ');

  return (
    <div className="space-y-8">
      {/* Main Champ bracket (with connectors) */}
      <ChampBracket slots={champSlots} teamsById={teamsById} />

      {/* Keeper + Toilet stacked underneath, grouped by stage */}
      <div className="grid gap-6 md:grid-cols-2">
        {PLACEMENT_COLUMNS.map((col) => (
          <BracketColumn
            key={col.id}
            title={col.title}
            slots={placementSlots.filter((slot) => col.slotIds.includes(slot.id))}
            teamsById={teamsById}
          />
        ))}
      </div>
    </div>
  );
};
