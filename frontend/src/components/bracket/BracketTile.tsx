// src/components/bracket/BracketTile.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';

interface BracketTileProps {
  slot: BracketSlot;
  teamsById: Map<number, Team>;
}

export const BracketTile: FC<BracketTileProps> = ({ slot, teamsById }) => {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4 gap-2">
        <div>
          <h2 className="card-title text-sm">{slot.label}</h2>
          <p className="text-[0.7rem] text-base-content/60">
            {slot.bracketId.toUpperCase()} • {slot.round}
          </p>
        </div>

        <ul className="mt-1 text-xs space-y-1">
          {slot.positions.map((pos, idx) => {
            if (!pos) {
              return (
                <li key={idx} className="italic text-base-content/60">
                  TBD
                </li>
              );
            }

            const team = pos.teamId != null ? teamsById.get(pos.teamId) : undefined;

            if (team) {
              return (
                <li key={idx}>
                  <div className="flex items-center gap-2">
                    {team.avatarUrl && (
                      <div className="avatar">
                        <div className="w-6 rounded-full">
                          <img src={team.avatarUrl} alt={team.teamName} />
                        </div>
                      </div>
                    )}
                    <span className="font-semibold">
                      {team.seed}. {team.teamName}
                    </span>
                    <span className="text-base-content/60">
                      ({team.record.wins}-{team.record.losses}
                      {team.record.ties ? `-${team.record.ties}` : ''})
                    </span>
                  </div>
                </li>
              );
            }

            if (pos.seed != null) {
              return <li key={idx}>Seed {pos.seed}</li>;
            }

            if (pos.isBye) {
              return (
                <li key={idx} className="italic text-base-content/60">
                  BYE
                </li>
              );
            }

            return (
              <li key={idx} className="italic text-base-content/60">
                TBD
              </li>
            );
          })}
        </ul>

        {slot.rewardTitle ? (
          <div className="mt-1 text-[0.7rem]">
            <div className="font-semibold">{slot.rewardTitle}</div>
            <div className="text-base-content/70">{slot.rewardText}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
