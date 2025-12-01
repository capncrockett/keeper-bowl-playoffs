// Shared bracket grid + connectors

import type { FC, ReactNode } from 'react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BracketTile } from './BracketTile';

type Anchor = 'top' | 'bottom';

interface LayoutCell {
  /** Unique per rendered cell (used for connectors). */
  id: string;
  /** Which bracket slot to render in this cell. */
  slotId: BracketSlot['id'] | null;
  /** Optional explicit row (1-based). If omitted, uses array order. */
  row?: number;
}

export interface BracketLayoutColumn {
  title?: string;
  subtitle?: string;
  cells: (LayoutCell | null)[];
}

export interface BracketConnector {
  fromId: string;
  toId: string;
  fromAnchor?: Anchor;
  toAnchor?: Anchor;
}

interface ConnectorLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface BracketGridProps {
  columns: BracketLayoutColumn[];
  connectors: BracketConnector[];
  slots: BracketSlot[];
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
  /** Tailwind-friendly row height control (applies to grid-auto-rows). */
  rowHeightClass?: string;
}

interface BracketMatchShellProps {
  cellId: string;
  children: ReactNode;
}

const BracketMatchShell: FC<BracketMatchShellProps> = ({ cellId, children }) => {
  return (
    <div className="relative flex flex-col items-stretch gap-1" data-cell-id={cellId} role="group">
      <div className="h-2 w-full" data-anchor="top" />
      <div className="flex-1">{children}</div>
      <div className="h-2 w-full" data-anchor="bottom" />
    </div>
  );
};

export const BracketGrid: FC<BracketGridProps> = ({
  columns,
  connectors,
  slots,
  teamsById,
  highlightTeamId,
  mode,
  rowHeightClass = 'auto-rows-[120px] md:auto-rows-[160px]',
}) => {
  const [connectorLines, setConnectorLines] = useState<ConnectorLine[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const slotById = useMemo(() => new Map(slots.map((s) => [s.id, s])), [slots]);

  const resolvedColumns = useMemo(() => {
    return columns.map((col) =>
      col.cells.map((cell, idx) => {
        if (!cell) return null;
        return {
          ...cell,
          row: cell.row ?? idx + 1,
        };
      }),
    );
  }, [columns]);

  const columnCount = columns.length;
  const maxRows = resolvedColumns.reduce((max, col) => {
    const colMax = col.reduce((m, cell) => (cell && cell.row ? Math.max(m, cell.row) : m), 0);
    return Math.max(max, colMax);
  }, 0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getAnchorCenter = (cellId: string, anchor: Anchor) => {
      const el = container.querySelector<HTMLElement>(
        `[data-cell-id="${cellId}"] [data-anchor="${anchor}"]`,
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

      connectors.forEach((conn) => {
        const from = getAnchorCenter(conn.fromId, conn.fromAnchor ?? 'bottom');
        const to = getAnchorCenter(conn.toId, conn.toAnchor ?? 'top');
        if (!from || !to) return;

        lines.push({
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
        });
      });

      return lines;
    };

    const updateLines = () => setConnectorLines(buildLines() ?? []);

    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [connectors, slots, resolvedColumns]);

  const gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

  return (
    <div className="w-full">
      {/* Column headers */}
      <div
        className="grid gap-1 md:gap-3 mb-1 md:mb-3"
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

      {/* Grid + connectors */}
      <div ref={containerRef} className="relative">
        <div
          className={`grid gap-2 md:gap-6 ${rowHeightClass}`}
          style={{ gridTemplateColumns: gridTemplateColumns }}
        >
          {/* Render cells */}
          {resolvedColumns.map((col, colIdx) =>
            col.map((cell) => {
              if (!cell || cell.slotId == null) return null;
              const slot = slotById.get(cell.slotId);
              if (!slot) return null;

              return (
                <div
                  key={cell.id}
                  style={{ gridColumn: colIdx + 1, gridRow: cell.row }}
                  className="min-w-0"
                >
                  <BracketMatchShell cellId={cell.id}>
                    <BracketTile
                      slot={slot}
                      teamsById={teamsById}
                      highlightTeamId={highlightTeamId}
                      mode={mode}
                    />
                  </BracketMatchShell>
                </div>
              );
            }),
          )}

          {/* Spacer to ensure full row count exists for alignment */}
          <div
            aria-hidden="true"
            style={{ gridColumn: '1 / span 1', gridRow: maxRows || 1 }}
            className="pointer-events-none opacity-0 select-none"
          />
        </div>

        {connectorLines.length > 0 && (
          <svg className="pointer-events-none absolute inset-0 text-base-content/30">
            {connectorLines.map((line, idx) => (
              <line
                key={idx}
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
