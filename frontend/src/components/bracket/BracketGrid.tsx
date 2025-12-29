// Shared bracket grid + connectors

import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile, BRACKET_TILE_BODY_HEIGHT_CLASS } from './BracketTile';

interface BracketColumnItem {
  id: string;
  slotId: BracketSlot['id'] | null;
  /** Optional override for the card title (e.g., BYE when masking a slot in Round 1). */
  titleOverride?: string;
  /** Optional: mask one position to show a BYE/TBD without altering the real slot data. */
  maskOppIndex?: 0 | 1;
  /** Optional class override for positioning within the column. */
  itemClassName?: string;
}

export interface BracketLayoutColumn {
  title?: string;
  subtitle?: string;
  items: BracketColumnItem[];
  /** Optional height override per column. */
  columnHeightClass?: string;
  /** Optional class override for the items container (e.g., justify-between). */
  itemsContainerClassName?: string;
  /** Optional class override for the column container. */
  columnClassName?: string;
}

interface BracketGridProps {
  columns: BracketLayoutColumn[];
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  scoreOverridesByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
  /** Base column height if none is provided per column. */
  defaultColumnHeightClass?: string;
  /** Optional override to apply the same height class to all columns (e.g., Keeper uses a shorter stack). */
  columnHeightClass?: string;
  /** Horizontal gap between columns. */
  colGapClass?: string;
}

interface BracketMatchShellProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

const BracketMatchShell: FC<BracketMatchShellProps> = ({ itemId, children, className }) => {
  return (
    <div
      className={['relative flex flex-col items-stretch gap-1 min-w-0 w-full', className]
        .filter(Boolean)
        .join(' ')}
      data-cell-id={itemId}
      role="group"
    >
      <div className="absolute inset-x-0 top-0 h-0 w-full pointer-events-none" data-anchor="top" />
      <div className="flex-1 min-w-0 w-full">{children}</div>
      <div
        className="absolute inset-x-0 bottom-0 h-0 w-full pointer-events-none"
        data-anchor="bottom"
      />
    </div>
  );
};

export const BracketGrid: FC<BracketGridProps> = ({
  columns,
  slots,
  teamsById,
  scoreOverridesByTeamId,
  highlightTeamId,
  mode,
  defaultColumnHeightClass = 'min-h-[600px] md:min-h-[720px]',
  columnHeightClass,
  colGapClass = 'gap-3 md:gap-10',
}) => {
  const slotById = useMemo(() => new Map(slots.map((s) => [s.id, s])), [slots]);

  const gridTemplateColumns = `repeat(${columns.length.toString()}, minmax(0, 1fr))`;
  const resolvedColumnHeight = columnHeightClass ?? defaultColumnHeightClass;

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

      {/* Columns with flex-stacked matchups */}
      <div className={`grid ${colGapClass}`} style={{ gridTemplateColumns: gridTemplateColumns }}>
        {columns.map((col, colIdx) => {
          const columnHeight = col.columnHeightClass ?? resolvedColumnHeight;
          return (
            <div
              key={colIdx}
              className={['flex flex-col min-w-0 w-full', columnHeight, col.columnClassName]
                .filter(Boolean)
                .join(' ')}
            >
              <div
                className={[
                  'flex-1 flex flex-col gap-2 outline-2 outline-offset-2 outline-pink-500 md:gap-4',
                  col.itemsContainerClassName,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {col.items.map((item) => {
                  if (!item.slotId) {
                    return (
                      <BracketMatchShell
                        key={item.id}
                        itemId={item.id}
                        className={item.itemClassName}
                      >
                        <div
                          className="card card-compact bg-base-100 w-full max-w-full min-w-0 h-full border border-base-300"
                          aria-hidden="true"
                        >
                          <div
                            className={`card-body p-2 md:p-3 ${BRACKET_TILE_BODY_HEIGHT_CLASS}`}
                          />
                        </div>
                      </BracketMatchShell>
                    );
                  }
                  const slot = slotById.get(item.slotId);
                  if (!slot) return null;

                  const displaySlot =
                    item.maskOppIndex == null
                      ? slot
                      : {
                          ...slot,
                          positions: slot.positions.map((pos, idx) =>
                            idx === item.maskOppIndex
                              ? { ...(pos ?? {}), teamId: undefined, isBye: true }
                              : pos && scoreOverridesByTeamId
                                ? {
                                    ...pos,
                                    currentPoints: scoreOverridesByTeamId.get(pos.teamId ?? -1),
                                  }
                                : pos,
                          ) as typeof slot.positions,
                        };

                  return (
                    <BracketMatchShell
                      key={item.id}
                      itemId={item.id}
                      className={item.itemClassName}
                    >
                      <BracketTile
                        slot={displaySlot}
                        teamsById={teamsById}
                        highlightTeamId={highlightTeamId}
                        mode={mode}
                        titleOverride={item.titleOverride}
                      />
                    </BracketMatchShell>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
