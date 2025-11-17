// src/components/bracket/ChampBracket.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

interface ChampBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

export const ChampBracket: FC<ChampBracketProps> = ({
  slots,
  teamsById,
  highlightTeamId,
  mode,
}) => {
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

        {/* Round 2 */}
        <div className="flex flex-col justify-between gap-8">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Round 2
          </h2>
          <div className="relative flex flex-col gap-16 pt-6 pb-6">
            {r2.map((slot) => (
              <BracketTile
                key={slot.id}
                slot={slot}
                teamsById={teamsById}
                highlightTeamId={highlightTeamId}
                mode={mode}
              />
            ))}
            {/* connector lines unchanged */}
          </div>
        </div>

        {/* Finals */}
        <div className="flex flex-col justify-between gap-8">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Finals
          </h2>
          <div className="relative flex flex-col gap-8 pt-10 pb-10">
            {finals.map((slot) => (
              <BracketTile
                key={slot.id}
                slot={slot}
                teamsById={teamsById}
                highlightTeamId={highlightTeamId}
                mode={mode}
              />
            ))}
            {/* connector lines unchanged */}
          </div>
        </div>
      </div>
    </div>
  );
};
