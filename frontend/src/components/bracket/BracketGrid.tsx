// Shared bracket grid + connectors

import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

interface LayoutItem {
  id: string;
  slotId: BracketSlot['id'] | null;
  /** Percent from top of the column container (0-100). */
  topPct: number;
}

export interface BracketLayoutColumn {
  title?: string;
  subtitle?: string;
  items: LayoutItem[];
}

interface BracketGridProps {
  columns: BracketLayoutColumn[];
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
  /** Tailwind-friendly height for the column containers. */
  columnHeightClass?: string;
}

interface BracketMatchShellProps {
  itemId: string;
  children: ReactNode;
}

const BracketMatchShell: FC<BracketMatchShellProps> = ({ itemId, children }) => {
  return (
    <div className="relative flex flex-col items-stretch gap-1" data-cell-id={itemId} role="group">
      <div className="h-2 w-full" data-anchor="top" />
      <div className="flex-1">{children}</div>
      <div className="h-2 w-full" data-anchor="bottom" />
    </div>
  );
};

export const BracketGrid: FC<BracketGridProps> = ({
  columns,
  slots,
  teamsById,
  highlightTeamId,
  mode,
  columnHeightClass = 'min-h-[720px] md:min-h-[880px]',
}) => {
  const slotById = useMemo(() => new Map(slots.map((s) => [s.id, s])), [slots]);

  const gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr))`;

  return (
    <div className="w-full">
      {/* Column headers */}
      <div
        className="grid gap-1 md:gap-3 mb-2 md:mb-4"
        style={{ gridTemplateColumns: gridTemplateColumns }}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col">
            {col.title && (
              <h2 className="text-[0.6rem] md:text-sm font-semibold tracking-wide uppercase text-base-content/70">
                {col.title}
              </h2>
            )}
            {col.subtitle && (
              <span className="text-[0.55rem] md:text-xs font-medium text-base-content/60">
                {col.subtitle}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Columns with absolute-positioned matchups */}
      <div className="grid gap-3 md:gap-8" style={{ gridTemplateColumns: gridTemplateColumns }}>
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className={`relative ${columnHeightClass}`}
          >
            {col.items.map((item) => {
              if (!item.slotId) return null;
              const slot = slotById.get(item.slotId);
              if (!slot) return null;

              return (
                <div
                  key={item.id}
                  className="absolute left-0 right-0"
                  style={{
                    top: `${item.topPct}%`,
                    transform: item.topPct === 0 ? undefined : 'translateY(-50%)',
                  }}
                >
                  <BracketMatchShell itemId={item.id}>
                    <BracketTile
                      slot={slot}
                      teamsById={teamsById}
                      highlightTeamId={highlightTeamId}
                      mode={mode}
                    />
                  </BracketMatchShell>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
