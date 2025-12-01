// src/components/bracket/BracketTile.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { TeamAvatars } from '../common/TeamAvatars';

interface BracketTileProps {
  slot: BracketSlot;
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

interface TeamRowProps {
  team?: Team;
  pos?: {
    seed?: number;
    teamId?: number;
    isBye?: boolean;
    currentPoints?: number;
  } | null;
  mode: 'score' | 'reward';
}

const TeamRow: FC<TeamRowProps> = ({ team, pos, mode }) => {
  const renderPlaceholderRow = (label: string) => (
    <div className="py-1.5 md:py-2 max-w-full overflow-hidden">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-6 md:w-10 rounded-full bg-base-300/60" />
        </div>
        {mode === 'score' && (
          <div className="flex flex-col items-end text-right leading-tight flex-shrink-0">
            <div className="text-[0.7rem] md:text-base font-semibold text-base-content/80">-</div>
            <div className="text-[0.6rem] md:text-xs text-base-content/60"></div>
          </div>
        )}
      </div>
      <div className="mt-1 min-w-0">
        <div className="font-semibold text-[0.65rem] md:text-sm truncate">{label}</div>
      </div>
    </div>
  );

  if (!pos) {
    return renderPlaceholderRow('TBD');
  }

  if (!team) {
    // BYE without a concrete team should still use the same visual layout
    if (pos.isBye) {
      const currentPoints = mode === 'score' ? pos.currentPoints : undefined;

      return (
        <div className="py-1.5 md:py-2 max-w-full overflow-hidden">
          {/* Top section: empty avatar space left, scores right */}
          <div className="flex justify-between items-start gap-2">
            {/* Empty avatar placeholder to keep layout consistent */}
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-6 md:w-10" />
            </div>

            {/* Scores on the right */}
            {mode === 'score' && (
              <div className="flex flex-col items-end text-right leading-tight flex-shrink-0">
                {/* Current week score */}
                <div className="text-[0.7rem] md:text-base font-semibold text-base-content/80">
                  {currentPoints != null && currentPoints !== 0 ? currentPoints.toFixed(2) : '-'}
                </div>
              </div>
            )}
          </div>

          {/* Bottom row: BYE label across full width */}
          <div className="mt-1 min-w-0">
            <div className="font-semibold text-[0.65rem] md:text-sm truncate">BYE</div>
          </div>
        </div>
      );
    }

    // For non-BYE unknown teams, just show seed or TBD
    if (pos.seed != null) {
      return renderPlaceholderRow(`Seed ${pos.seed}`);
    }
    return renderPlaceholderRow('TBD');
  }

  const isBye = !!pos.isBye;
  const currentPoints = mode === 'score' ? (pos.currentPoints ?? team.pointsFor) : undefined;

  return (
    <div className="py-1.5 md:py-2 max-w-full overflow-hidden">
      {/* Top section: avatar left, scores right */}
      <div className="flex justify-between items-start gap-2">
        {/* Avatar (top-left) */}
        <div className="flex items-center gap-1 md:gap-2">
          <TeamAvatars
            teamName={team.teamName}
            teamAvatarUrl={team.teamAvatarUrl}
            userAvatarUrl={team.userAvatarUrl}
            userDisplayName={team.ownerDisplayName}
            showUserAvatar={false}
            size="md"
            className="md:scale-125"
          />
        </div>

        {/* Scores on the right */}
        {mode === 'score' && (
          <div className="flex flex-col items-end text-right leading-tight flex-shrink-0">
            {/* Current week score */}
            <div className="text-[0.7rem] md:text-base font-semibold text-base-content/80">
              {isBye
                ? '-'
                : currentPoints != null && currentPoints !== 0
                  ? currentPoints.toFixed(2)
                  : '-'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom row: team name across full width (or BYE) */}
      <div className="mt-1 min-w-0">
        <div className="font-semibold text-[0.65rem] md:text-sm truncate">
          {isBye ? 'BYE' : team.teamName}
        </div>
      </div>
    </div>
  );
};

export const BracketTile: FC<BracketTileProps> = ({ slot, teamsById, highlightTeamId, mode }) => {
  const involvesHighlight =
    highlightTeamId != null && slot.positions.some((pos) => pos?.teamId === highlightTeamId);

  const cardClassName = [
    'card card-compact bg-base-100 w-full max-w-full overflow-hidden border border-base-300',
    involvesHighlight ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm',
  ].join(' ');

  return (
    <div className={cardClassName}>
      <div className="card-body gap-1.5 p-2 md:p-3">
        {/* Team rows */}
        <div className="divide-y divide-base-300">
          {slot.positions.map((pos, idx) => {
            const team = pos?.teamId != null ? teamsById.get(pos.teamId) : undefined;
            return <TeamRow key={idx} team={team} pos={pos} mode={mode} />;
          })}
        </div>

        {/* Reward text - only on desktop in reward mode */}
        {slot.rewardTitle && mode === 'reward' && (
          <div className="mt-2 text-[0.7rem] hidden md:block border-t border-base-300 pt-2 max-w-full overflow-hidden">
            <div className="font-semibold text-base-content/90">{slot.rewardTitle}</div>
            <div className="text-base-content/70 text-[0.65rem]">{slot.rewardText}</div>
          </div>
        )}
      </div>
    </div>
  );
};
