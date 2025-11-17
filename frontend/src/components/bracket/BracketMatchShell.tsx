// src/components/bracket/BracketMatchShell.tsx
import type { ReactNode } from 'react';
import type { BracketSlotId } from '../../bracket/types';

type BracketMatchShellProps = {
  slotId: BracketSlotId;
  children: ReactNode;
};

/**
 * Structural wrapper for a single bracket "game"/slot.
 * - Adds top/bottom anchors for future connector lines
 * - Does not change visual styling of the child card
 */
export function BracketMatchShell({ slotId, children }: BracketMatchShellProps) {
  return (
    <div className="relative flex flex-col items-stretch gap-1" data-slot-id={slotId} role="group">
      {/* Top anchor: future incoming connector target */}
      <div className="h-2 w-full" data-anchor="top" />

      {/* Existing card content goes here */}
      <div className="flex-1">{children}</div>

      {/* Bottom anchor: future outgoing / fork connector target */}
      <div className="h-2 w-full" data-anchor="bottom" />
    </div>
  );
}
