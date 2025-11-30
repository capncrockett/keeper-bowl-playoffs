// src/components/bracket/KeeperBracket.tsx

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

interface KeeperBracketProps {
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
}

export const KeeperBracket: FC<KeeperBracketProps> = ({
  slots,
  teamsById,
  highlightTeamId,
  mode,
}) => {
  const [connectorLines, setConnectorLines] = useState<ConnectorLine[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Column 1: Floaters and Splashbacks
  const floaters = useMemo(
    () => slots.filter((s) => s.id === 'keeper_floater1' || s.id === 'keeper_floater2'),
    [slots],
  );
  const splashbacks = useMemo(
    () => slots.filter((s) => s.id === 'keeper_splashback1' || s.id === 'keeper_splashback2'),
    [slots],
  );

  // Column 2: Placement games
  const placements = useMemo(
    () => slots.filter((s) => s.id === 'keeper_5th_6th' || s.id === 'keeper_7th_8th'),
    [slots],
  );

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

      // Floaters feed into Splashbacks (already done implicitly by positioning)
      // Splashbacks feed into placement games
      if (splashbacks.length > 0 && placements.length > 0) {
        connect(splashbacks[0].id, 'bottom', placements[0].id, 'top'); // Splashback1 → 5th/6th
      }
      if (splashbacks.length > 1 && placements.length > 1) {
        connect(splashbacks[1].id, 'bottom', placements[0].id, 'top'); // Splashback2 → 5th/6th
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
  }, [slots, splashbacks, placements]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative grid grid-cols-2 gap-1 md:gap-8">
        {/* Column 1: Floaters vs Splashbacks */}
        <div className="flex flex-col justify-start">
          <h2 className="text-[0.6rem] md:text-sm font-semibold tracking-wide uppercase text-base-content/70 mb-1 md:mb-3">
            Keeper Bowl
          </h2>
          <div className="flex flex-col gap-2 md:gap-4">
            {/* Floaters */}
            {floaters.map((slot) => (
              <BracketMatchShell key={slot.id} slotId={slot.id}>
                <BracketTile
                  slot={slot}
                  teamsById={teamsById}
                  highlightTeamId={highlightTeamId}
                  mode={mode}
                />
              </BracketMatchShell>
            ))}
            {/* Splashbacks */}
            <div className="mt-2 md:mt-4">
              <h3 className="text-[0.55rem] md:text-xs font-semibold tracking-wide uppercase text-base-content/60 mb-1 md:mb-2">
                Splashback
              </h3>
              {splashbacks.map((slot) => (
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
        </div>

        {/* Column 2: Placement Finals */}
        <div className="flex flex-col justify-start">
          <h2 className="text-[0.6rem] md:text-sm font-semibold tracking-wide uppercase text-base-content/70 mb-1 md:mb-3">
            Placement
          </h2>
          <div className="relative flex flex-col gap-3 md:gap-6 pt-2 md:pt-4">
            {placements.map((slot) => (
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
