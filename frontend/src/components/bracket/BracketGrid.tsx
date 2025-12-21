// Shared bracket grid + connectors

import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import type { BracketSlot, BracketSlotId } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

export type BracketItemKind = 'match' | 'bye';

export interface BracketColumnItem {
  id: string;
  slotId: BracketSlotId;
  kind: BracketItemKind;
  /** Optional override for the card title (e.g., BYE when masking a slot in Round 1). */
  titleOverride?: string;
  /** Optional: mask one position to show a BYE/TBD without altering the real slot data. */
  maskOppIndex?: 0 | 1;
}

export interface BracketColumnDef {
  id: string;
  title: string;
  subtitle?: string;
  items: BracketColumnItem[];
  /** Optional height override per column. */
  columnHeightClass?: string;
}

interface BracketGridProps {
  columns: BracketColumnDef[];
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  scoreOverridesByTeamId?: Map<number, number>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
  /** Optional override to apply the same height class to all columns (e.g., Keeper uses a shorter stack). */
  columnHeightClass?: string;
}

interface BracketMatchShellProps {
  itemId: string;
  children: ReactNode;
}

const BracketMatchShell: FC<BracketMatchShellProps> = ({ itemId, children }) => {
  return (
    <div
      className="relative flex flex-col items-stretch gap-1 min-w-0 w-full"
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
  columnHeightClass,
  defaultHeightScale = 1,
  colGapClass = 'gap-3 md:gap-10',
}) => {
  const slotById = useMemo(() => new Map(slots.map((s) => [s.id, s])), [slots]);
  const resolvedColumnHeight = columnHeightClass ?? 'min-h-[360px] md:min-h-[640px]';

  return (
    <div className="w-full grid grid-cols-3 gap-2 md:gap-4 lg:gap-6">
      {columns.map((col) => {
        const columnHeight = col.columnHeightClass ?? resolvedColumnHeight;
        return (
          <div key={col.id} className={`flex flex-col min-w-0 w-full ${columnHeight}`}>
            <div className="mb-1 text-center">
              <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-base-content/80">
                {col.title}
              </div>
              {col.subtitle && (
                <div className="text-[9px] md:text-[11px] text-base-content/60 leading-tight">
                  {col.subtitle}
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
                <div
                  key={item.id}
                  className="absolute left-0 right-0"
                  style={{
                    top: `${top.toString()}%`,
                    transform: center ? 'translateY(-50%)' : undefined,
                  }}
                >
                  <BracketMatchShell itemId={item.id}>
                  <BracketTile
                    slot={displaySlot}
                    teamsById={teamsById}
                    highlightTeamId={highlightTeamId}
                    mode={mode}
                    titleOverride={item.titleOverride}
                  />
                  </BracketMatchShell>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-2 md:gap-4">
              {col.items.map((item) => {
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
                            : pos,
                        ) as typeof slot.positions,
                      };

                const titleOverride = item.titleOverride ?? (item.kind === 'bye' ? 'BYE' : undefined);

                return (
                  <BracketMatchShell key={item.id} itemId={item.id}>
                    <BracketTile
                      slot={displaySlot}
                      teamsById={teamsById}
                      highlightTeamId={highlightTeamId}
                      mode={mode}
                      titleOverride={titleOverride}
                    />
                  </BracketMatchShell>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
