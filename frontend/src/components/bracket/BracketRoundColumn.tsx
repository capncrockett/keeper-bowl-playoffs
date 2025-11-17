// src/components/bracket/BracketRoundColumn.tsx
import type { ReactNode } from 'react';

type BracketRoundColumnProps = {
  title?: string;
  children: ReactNode;
};

export function BracketRoundColumn({ title, children }: BracketRoundColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <div className="text-center text-sm font-semibold uppercase tracking-wide">{title}</div>
      )}

      {/* Stack all games for this round */}
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
