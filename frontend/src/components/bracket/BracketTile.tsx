// src/components/bracket/BracketTile.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';

interface BracketTileProps {
  slot: BracketSlot;
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

interface TeamRowProps {
  team?: Team;
  pos?: { seed?: number; teamId?: number; isBye?: boolean } | null;
  mode: 'score' | 'reward';
}

const TeamRow: FC<TeamRowProps> = ({ team, pos, mode }) => {
  if (!pos) {
    return <div className="text-xs italic text-base-content/60">TBD</div>;
  }

  if (pos.isBye) {
    return <div className="text-xs italic text-base-content/60 text-center py-2">BYE</div>;
  }

  if (!team) {
    if (pos.seed != null) {
      return <div className="text-xs text-base-content/70">Seed {pos.seed}</div>;
    }
    return <div className="text-xs italic text-base-content/60">TBD</div>;
  }

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {team.avatarUrl && (
          <div className="avatar flex-shrink-0">
            <div className="w-8 md:w-10 rounded-full">
              <img src={team.avatarUrl} alt={team.teamName} />
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-xs md:text-sm truncate">
            <span className="hidden md:inline">{team.seed}. </span>
            {team.teamName}
          </div>
          {mode === 'score' && (
            <div className="text-[0.7rem] text-base-content/60 hidden md:block">
              {team.record.wins}-{team.record.losses}
              {team.record.ties ? `-${team.record.ties}` : ''}
            </div>
          )}
        </div>
      </div>
      {mode === 'score' && (
        <div className="text-sm md:text-base font-semibold text-base-content/80 flex-shrink-0">
          {team.pointsFor.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export const BracketTile: FC<BracketTileProps> = ({ slot, teamsById, highlightTeamId, mode }) => {
  const involvesHighlight =
    highlightTeamId != null && slot.positions.some((pos) => pos?.teamId === highlightTeamId);

  const cardClassName = [
    'card bg-base-200 rounded-lg',
    involvesHighlight ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm',
  ].join(' ');

  return (
    <div className={cardClassName}>
      <div className="card-body p-2 md:p-4 gap-1 md:gap-2">
        {/* Title - hidden on mobile */}
        <div className="hidden md:block">
          <h2 className="text-sm font-semibold text-base-content/90">{slot.label}</h2>
        </div>

        {/* Team rows */}
        <div className="divide-y divide-base-300">
          {slot.positions.map((pos, idx) => {
            const team = pos?.teamId != null ? teamsById.get(pos.teamId) : undefined;
            return <TeamRow key={idx} team={team} pos={pos} mode={mode} />;
          })}
        </div>

        {/* Reward text - only on desktop in reward mode */}
        {slot.rewardTitle && mode === 'reward' && (
          <div className="mt-2 text-[0.7rem] hidden md:block border-t border-base-300 pt-2">
            <div className="font-semibold text-base-content/90">{slot.rewardTitle}</div>
            <div className="text-base-content/70 text-[0.65rem]">{slot.rewardText}</div>
          </div>
        )}
      </div>
    </div>
  );
};
