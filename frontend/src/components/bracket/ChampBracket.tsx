// src/components/bracket/ChampBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

interface ChampBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
}

export const ChampBracket: FC<ChampBracketProps> = ({ slots, teamsById }) => {
  const r1 = slots.filter((s) => s.id === 'champ_r1_g1' || s.id === 'champ_r1_g2');
  const r2 = slots.filter((s) => s.id === 'champ_r2_g1' || s.id === 'champ_r2_g2');
  const finals = slots.filter((s) => s.id === 'champ_finals' || s.id === 'champ_3rd');

  const champBye1 = slots.find((s) => s.id === 'champ_r2_g1');
  const champBye2 = slots.find((s) => s.id === 'champ_r2_g2');

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative grid gap-8 md:grid-cols-3 min-w-[720px]">
        {/* Round 1 */}
        <div className="flex flex-col justify-between gap-8">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Round 1
          </h2>
          <div className="flex flex-col gap-8">
            {champBye1 && champBye1.positions[0]?.teamId != null && (
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body p-4 gap-2">
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-base-content/70">Bye</h3>
                    <p className="text-[0.7rem] text-base-content/60">CHAMP • round_1</p>
                  </div>
                  <ul className="mt-1 text-xs space-y-1">
                    {(() => {
                      const pos = champBye1.positions[0];
                      const team =
                        pos && pos.teamId != null ? teamsById.get(pos.teamId) : undefined;
                      if (!team) return null;
                      return (
                        <li>
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
                    })()}
                    <li className="italic text-base-content/60">BYE</li>
                  </ul>
                </div>
              </div>
            )}

            {champBye2 && champBye2.positions[0]?.teamId != null && (
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body p-4 gap-2">
                  <div>
                    <h3 className="text-xs font-semibold uppercase text-base-content/70">Bye</h3>
                    <p className="text-[0.7rem] text-base-content/60">CHAMP • round_1</p>
                  </div>
                  <ul className="mt-1 text-xs space-y-1">
                    {(() => {
                      const pos = champBye2.positions[0];
                      const team =
                        pos && pos.teamId != null ? teamsById.get(pos.teamId) : undefined;
                      if (!team) return null;
                      return (
                        <li>
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
                    })()}
                    <li className="italic text-base-content/60">BYE</li>
                  </ul>
                </div>
              </div>
            )}

            {r1.map((slot) => (
              <BracketTile key={slot.id} slot={slot} teamsById={teamsById} />
            ))}
          </div>
        </div>

        {/* Round 2 */}
        <div className="flex flex-col justify-between gap-8">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Round 2
          </h2>
          <div className="relative flex flex-col gap-16 pt-6 pb-6">
            {r2.map((slot) => (
              <BracketTile key={slot.id} slot={slot} teamsById={teamsById} />
            ))}

            {/* simple connector “brackets” between R1 and R2 */}
            <div className="pointer-events-none absolute inset-y-0 left-[-3.5rem] hidden md:block">
              {/* top connector */}
              <div className="relative h-1/2">
                <div className="absolute top-1/2 left-0 w-14 border-t border-base-300" />
                <div className="absolute top-0 left-0 h-full border-l border-base-300" />
              </div>
              {/* bottom connector */}
              <div className="relative h-1/2">
                <div className="absolute top-1/2 left-0 w-14 border-t border-base-300" />
                <div className="absolute top-0 left-0 h-full border-l border-base-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Finals */}
        <div className="flex flex-col justify-between gap-8">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Finals
          </h2>
          <div className="relative flex flex-col gap-8 pt-10 pb-10">
            {finals.map((slot) => (
              <BracketTile key={slot.id} slot={slot} teamsById={teamsById} />
            ))}

            {/* connectors from R2 to Finals (very simple “triangle” shape) */}
            <div className="pointer-events-none absolute inset-y-0 left-[-3.5rem] hidden md:block">
              {/* Championship connector */}
              <div className="relative h-1/2">
                <div className="absolute top-1/2 left-0 w-14 border-t border-base-300" />
                <div className="absolute top-0 left-0 h-full border-l border-base-300" />
              </div>
              {/* 3rd place connector */}
              <div className="relative h-1/2">
                <div className="absolute top-1/2 left-0 w-14 border-t border-base-300" />
                <div className="absolute top-0 left-0 h-full border-l border-base-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
