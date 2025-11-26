// src/components/bracket/ChampBracket.tsx

import type { FC, ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

interface BracketMatchShellProps {
  slotId: BracketSlot['id'];
  children: ReactNode;
}

const BracketMatchShell: FC<BracketMatchShellProps> = ({ slotId, children }) => {
  return (
    <div className="relative flex flex-col items-stretch gap-1" data-slot-id={slotId} role="group">
      {/* Top anchor for future incoming connectors */}
      <div className="h-2 w-full" data-anchor="top" />

      {/* Existing card content */}
      <div className="flex-1">{children}</div>

      {/* Bottom anchor for future outgoing / fork connectors */}
      <div className="h-2 w-full" data-anchor="bottom" />
    </div>
  );
};

interface ConnectorLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

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
  const [connectorLines, setConnectorLines] = useState<ConnectorLine[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const r1 = slots.filter((s) => s.id === 'champ_r1_g1' || s.id === 'champ_r1_g2');
  const r2 = slots.filter((s) => s.id === 'champ_r2_g1' || s.id === 'champ_r2_g2');
  const finals = slots.filter((s) => s.id === 'champ_finals' || s.id === 'champ_3rd');

  const champBye1 = slots.find((s) => s.id === 'champ_r2_g1');
  const champBye2 = slots.find((s) => s.id === 'champ_r2_g2');

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getAnchorCenter = (slotId: BracketSlot['id'], anchor: 'top' | 'bottom') => {
      const el = container.querySelector<HTMLElement>(
        `[data-slot-id="${slotId}"] [data-anchor="${anchor}"]`,
      );
      if (!el) return null;

      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
    };

    const buildLines = () => {
      const lines: ConnectorLine[] = [];

      const connect = (
        fromSlotId: BracketSlot['id'],
        fromAnchor: 'top' | 'bottom',
        toSlotId: BracketSlot['id'],
        toAnchor: 'top' | 'bottom',
      ) => {
        const from = getAnchorCenter(fromSlotId, fromAnchor);
        const to = getAnchorCenter(toSlotId, toAnchor);
        if (!from || !to) return;
        lines.push({
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
        });
      };

      // Safely connect based on the actual slots rendered in each column
      const r1Slots = r1;
      const r2Slots = r2;
      const finalSlots = finals;

      // Round 1 winners feed into Round 2 games
      if (r1Slots.length > 0 && r2Slots.length > 0) {
        connect(r1Slots[0].id, 'bottom', r2Slots[0].id, 'top');
      }
      if (r1Slots.length > 1 && r2Slots.length > 1) {
        connect(r1Slots[1].id, 'bottom', r2Slots[1].id, 'top');
      }

      // Round 2 winners feed into the Championship game
      const champGame = finalSlots[0];
      if (champGame && r2Slots.length > 0) {
        connect(r2Slots[0].id, 'bottom', champGame.id, 'top');
      }
      if (champGame && r2Slots.length > 1) {
        connect(r2Slots[1].id, 'bottom', champGame.id, 'top');
      }

      return lines;
    };

    const updateLines = () => {
      const lines = buildLines();
      setConnectorLines(lines ?? []);
    };

    updateLines();

    window.addEventListener('resize', updateLines);
    return () => {
      window.removeEventListener('resize', updateLines);
    };
  }, [slots]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative grid grid-cols-3 gap-1 md:gap-8">
        {/* Round 1 */}
        <div className="flex flex-col justify-between">
          <h2 className="text-[0.6rem] md:text-sm font-semibold tracking-wide uppercase text-base-content/70 mb-1 md:mb-3">
            Round 1
          </h2>
          <div className="flex flex-col gap-2 md:gap-6">
            {/* 1 Seed Bye */}
            {champBye1 && champBye1.positions[0]?.teamId != null && (
              <div className="card bg-base-200 shadow-sm border border-base-300">
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
            {/* Main Champ R1 match */}
            {r1.map((slot) => (
              <BracketMatchShell key={slot.id} slotId={slot.id}>
                <BracketTile
                  slot={slot}
                  teamsById={teamsById}
                  highlightTeamId={highlightTeamId}
                  mode={mode}
                />
              </BracketMatchShell>
            ))}
            {/* 2 Seed Bye */}
            {champBye2 && champBye2.positions[0]?.teamId != null && (
              <div className="card bg-base-200 shadow-sm border border-base-300">
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
          </div>
        </div>

        {/* Round 2 */}
        <div className="flex flex-col justify-between">
          <h2 className="text-[0.6rem] md:text-sm font-semibold tracking-wide uppercase text-base-content/70 mb-1 md:mb-3">
            Round 2
          </h2>
          <div className="relative flex flex-col gap-4 md:gap-16 pt-2 md:pt-6 pb-2 md:pb-6">
            {r2.map((slot) => (
              <BracketMatchShell key={slot.id} slotId={slot.id}>
                <BracketTile
                  slot={slot}
                  teamsById={teamsById}
                  highlightTeamId={highlightTeamId}
                  mode={mode}
                />
              </BracketMatchShell>
            ))}
            {/* connector lines unchanged */}
          </div>
        </div>

        {/* Finals */}
        <div className="flex flex-col justify-between">
          <h2 className="text-[0.6rem] md:text-sm font-semibold tracking-wide uppercase text-base-content/70 mb-1 md:mb-3">
            Finals
          </h2>
          <div className="relative flex flex-col gap-3 md:gap-8 pt-3 md:pt-10 pb-3 md:pb-10">
            {finals.map((slot) => (
              <BracketMatchShell key={slot.id} slotId={slot.id}>
                <BracketTile
                  slot={slot}
                  teamsById={teamsById}
                  highlightTeamId={highlightTeamId}
                  mode={mode}
                />
              </BracketMatchShell>
            ))}
            {/* connector lines unchanged */}
          </div>
        </div>
        {connectorLines.length > 0 && (
          <svg className="pointer-events-none absolute inset-0 text-base-content/30">
            {connectorLines.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                strokeWidth={2}
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};
