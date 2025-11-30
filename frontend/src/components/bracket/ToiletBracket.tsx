// src/components/bracket/ToiletBracket.tsx

import type { FC, ReactNode } from 'react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
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

interface ToiletBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

export const ToiletBracket: FC<ToiletBracketProps> = ({
  slots,
  teamsById,
  highlightTeamId,
  mode,
}) => {
  const [connectorLines, setConnectorLines] = useState<ConnectorLine[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const r1 = useMemo(
    () => slots.filter((s) => s.id === 'toilet_r1_g1' || s.id === 'toilet_r1_g2'),
    [slots],
  );
  const r2 = useMemo(
    () => slots.filter((s) => s.id === 'toilet_r2_g1' || s.id === 'toilet_r2_g2'),
    [slots],
  );
  const finals = useMemo(
    () => slots.filter((s) => s.id === 'toilet_finals' || s.id === 'toilet_9th_10th'),
    [slots],
  );

  const toiletBye1 = useMemo(() => slots.find((s) => s.id === 'toilet_r2_g1'), [slots]);
  const toiletBye2 = useMemo(() => slots.find((s) => s.id === 'toilet_r2_g2'), [slots]);

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

      // Round 2 winners feed into the Poop King final
      const poopKingGame = finalSlots[0];
      if (poopKingGame && r2Slots.length > 0) {
        connect(r2Slots[0].id, 'bottom', poopKingGame.id, 'top');
      }
      if (poopKingGame && r2Slots.length > 1) {
        connect(r2Slots[1].id, 'bottom', poopKingGame.id, 'top');
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
  }, [slots, r1, r2, finals]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative grid grid-cols-3 gap-1 md:gap-8">
        {/* Round 1 */}
        <div className="flex flex-col justify-between">
          <h2 className="text-[0.6rem] md:text-sm font-semibold tracking-wide uppercase text-base-content/70 mb-1 md:mb-3">
            Round 1
          </h2>
          <div className="flex flex-col gap-2 md:gap-6">
            {/* 12 Seed Bye */}
            {toiletBye1 && toiletBye1.positions[0]?.teamId != null && (
              <BracketMatchShell slotId={'toilet_bye1' as BracketSlot['id']}>
                <BracketTile
                  slot={toiletBye1}
                  teamsById={teamsById}
                  highlightTeamId={highlightTeamId}
                  mode={mode}
                />
              </BracketMatchShell>
            )}
            {/* Main Toilet R1 matches */}
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
            {/* 11 Seed Bye */}
            {toiletBye2 && toiletBye2.positions[0]?.teamId != null && (
              <BracketMatchShell slotId={'toilet_bye2' as BracketSlot['id']}>
                <BracketTile
                  slot={toiletBye2}
                  teamsById={teamsById}
                  highlightTeamId={highlightTeamId}
                  mode={mode}
                />
              </BracketMatchShell>
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
