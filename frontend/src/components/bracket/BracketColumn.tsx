// src/components/bracket/BracketColumn.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

interface BracketColumnProps {
  title: string;
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
}

export const BracketColumn: FC<BracketColumnProps> = ({ title, slots, teamsById }) => {
  if (slots.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
        {title}
      </h2>
      <div className="space-y-3">
        {slots.map((slot) => (
          <BracketTile key={slot.id} slot={slot} teamsById={teamsById} />
        ))}
      </div>
    </div>
  );
};
