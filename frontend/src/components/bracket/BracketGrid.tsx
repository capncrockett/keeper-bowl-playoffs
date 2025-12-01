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
  /** Center the card on the percent marker (translateY(-50%)). Defaults to false. */
  centerOnPct?: boolean;
}

export interface BracketLayoutColumn {
  title?: string;
  subtitle?: string;
  items: LayoutItem[];
  /** Optional height override per column. */
  columnHeightClass?: string;
  /** Optional scale factor to stretch topPct spacing (e.g., 1.2 makes 50% behave like 60%). */
  heightScale?: number;
}

interface BracketGridProps {
  columns: BracketLayoutColumn[];
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
  /** Base column height if none is provided per column. */
  defaultColumnHeightClass?: string;
  /** Optional override to apply the same height class to all columns (e.g., Keeper uses a shorter stack). */
  columnHeightClass?: string;
  /** Default height scale applied when a column doesn't provide one. */
  defaultHeightScale?: number;
  /** Horizontal gap between columns. */
  colGapClass?: string;
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
  defaultColumnHeightClass = 'min-h-[600px] md:min-h-[720px]',
  columnHeightClass,
  defaultHeightScale = 1,
  colGapClass = 'gap-3 md:gap-10',
}) => {
  const slotById = useMemo(() => new Map(slots.map((s) => [s.id, s])), [slots]);

  const gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr))`;

  return (
    <div className="w-full">
      {/* Column headers */}
      <div
        className={`grid ${colGapClass} mb-2 md:mb-4`}
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
      <div className={`grid ${colGapClass}`} style={{ gridTemplateColumns: gridTemplateColumns }}>
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className={`relative ${col.columnHeightClass ?? columnHeightClass ?? defaultColumnHeightClass}`}
          >
            {col.items.map((item) => {
              if (!item.slotId) return null;
              const slot = slotById.get(item.slotId);
              if (!slot) return null;

              const center = item.centerOnPct === true;
              const scale = col.heightScale ?? defaultHeightScale;
              const top = item.topPct * scale;

              return (
                <div
                  key={item.id}
                  className="absolute left-0 right-0"
                  style={{
                    top: `${top}%`,
                    transform: center ? 'translateY(-50%)' : undefined,
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
