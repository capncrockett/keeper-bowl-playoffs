import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

interface BracketColumnProps {
  title: string;
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

export const BracketColumn: FC<BracketColumnProps> = ({
  title,
  slots,
  teamsById,
  highlightTeamId,
  mode,
}) => {
  if (slots.length === 0) return null;

  return (
    <div className="space-y-2 md:space-y-3">
      <h2 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-base-content/70">
        {title}
      </h2>
      <div className="space-y-2 md:space-y-3">
        {slots.map((slot) => (
          <BracketTile
            key={slot.id}
            slot={slot}
            teamsById={teamsById}
            highlightTeamId={highlightTeamId}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
};
