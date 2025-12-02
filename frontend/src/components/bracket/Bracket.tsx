// src/components/bracket/Bracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { ChampBracket } from './ChampBracket';
import { KeeperBracket } from './KeeperBracket';
import { ToiletBracket } from './ToiletBracket';

interface BracketProps {
  slots: BracketSlot[];
  teams: Team[];
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

export const Bracket: FC<BracketProps> = ({ slots, teams, highlightTeamId, mode }) => {
  const teamsById = new Map<number, Team>();
  teams.forEach((t) => teamsById.set(t.sleeperRosterId, t));

  const champSlots = slots.filter((s) => s.bracketId === 'champ');
  const keeperSlots = slots.filter((s) => s.bracketId === 'keeper');
  const toiletSlots = slots.filter((s) => s.bracketId === 'toilet');

  return (
    <div className="space-y-6 md:space-y-12">
      {/* Champ Bowl bracket */}
      <div>
        <h2 className="text-sm md:text-lg font-bold mb-3 md:mb-4 text-base-content">Champ Bowl</h2>
        <ChampBracket
          slots={champSlots}
          teamsById={teamsById}
          highlightTeamId={highlightTeamId}
          mode={mode}
        />
      </div>

      {/* Keeper Bowl bracket */}
      <div className="mt-20">
        <h2 className="text-sm md:text-lg font-bold mb-3 md:mb-4 text-base-content">Keeper Bowl</h2>
        <KeeperBracket
          slots={keeperSlots}
          teamsById={teamsById}
          highlightTeamId={highlightTeamId}
          mode={mode}
        />
      </div>

      {/* Toilet Bowl bracket */}
      <div className="mt-20">
        <h2 className="text-sm md:text-lg font-bold mb-3 md:mb-4 text-base-content">Toilet Bowl</h2>
        <ToiletBracket
          slots={toiletSlots}
          teamsById={teamsById}
          highlightTeamId={highlightTeamId}
          mode={mode}
        />
      </div>
    </div>
  );
};
