// src/components/bracket/BracketTile.tsx

import type { FC } from 'react';
import type { BracketSlot } from '../../bracket/types';
import type { BracketRoutingRule } from '../../bracket/types';
import type { Team } from '../../models/fantasy';
import { BRACKET_TEMPLATE } from '../../bracket/template';
import { ROUTING_RULES } from '../../bracket/routingRules';
import { TeamAvatars } from '../common/TeamAvatars';

interface BracketTileProps {
  slot: BracketSlot;
  teamsById: Map<number, Team>;
  highlightTeamId?: number | null;
  mode: 'score' | 'reward';
  titleOverride?: string;
}

interface TeamRowProps {
  team?: Team;
  pos?: {
    seed?: number;
    teamId?: number;
    isBye?: boolean;
    currentPoints?: number;
  } | null;
  mode: 'score' | 'reward';
  round: BracketSlot['round'];
  hasBye: boolean;
}

const FLIPPABLE_ROUNDS = new Set<BracketSlot['round']>([
  'champ_round_1',
  'champ_round_2',
  'champ_finals',
  'champ_misc',
  'keeper_main',
  'keeper_misc',
  'toilet_round_1',
  'toilet_round_2',
  'toilet_finals',
  'toilet_misc',
]);

const SLOT_LABEL_BY_ID = BRACKET_TEMPLATE.reduce(
  (acc, slot) => acc.set(slot.id, slot.label),
  new Map<BracketSlot['id'], string>(),
);

const SLOT_BY_ID = BRACKET_TEMPLATE.reduce(
  (acc, slot) => acc.set(slot.id, slot),
  new Map<BracketSlot['id'], BracketSlot>(),
);

const ROUTE_BY_FROM_ID = ROUTING_RULES.reduce(
  (acc, rule) => acc.set(rule.fromSlotId, rule),
  new Map<BracketSlot['id'], BracketRoutingRule>(),
);

const cleanLabel = (label: string): string => label.replace(/\s*\(.*?\)\s*$/, '');

const SLOT_TITLES: Partial<Record<BracketSlot['id'], string>> = {
  // Champ round 1 games
  champ_r1_g1: 'Game 1',
  champ_r1_g2: 'Game 2',
  // Keeper semis
  keeper_splashback1: 'Keeper Semis',
  keeper_splashback2: 'Keeper Semis',
  // Toilet round 1 games
  toilet_r1_g1: 'Game 1',
  toilet_r1_g2: 'Game 2',
};

const ROUND_TITLES: Partial<Record<BracketSlot['round'], string>> = {
  champ_round_1: 'Champ Round 1',
  champ_round_2: 'Champ Semis',
  champ_finals: 'Championship',
  // Let 3rd place games use their labels (e.g., "3rd Place Game")
  keeper_main: 'Keeper Bowl',
  // Let keeper placement games use their labels (5th/6th, 7th/8th)
  toilet_round_1: 'Toilet Round 1',
  toilet_round_2: 'Toilet Semis',
  toilet_finals: 'Toilet Final',
  // Show losers from Toilet R2 flowing to Poop Final (9th/10th)
  toilet_misc: 'Poop Final',
};

const TEAM_NAME_CLASS = 'bracket-team-name font-semibold text-[0.65rem] md:text-sm leading-tight';
const SCORE_CLASS = 'bracket-score text-[0.7rem] md:text-base font-semibold text-base-content/80';

function describeDestination(
  dest: BracketRoutingRule['winnerGoesTo'] | BracketRoutingRule['loserGoesTo'],
) {
  if (!dest) return null;
  const targetSlot = SLOT_BY_ID.get(dest.slotId);
  const label =
    (targetSlot ? (ROUND_TITLES[targetSlot.round] ?? cleanLabel(targetSlot.label)) : null) ??
    cleanLabel(SLOT_LABEL_BY_ID.get(dest.slotId) ?? dest.slotId);
  const lane = dest.positionIndex === 0 ? 'top slot' : 'bottom slot';
  return `${label} (${lane})`;
}

const TeamRow: FC<TeamRowProps> = ({ team, pos, mode, round, hasBye }) => {
  const seed = pos?.seed ?? team?.seed;
  const showSeedBadge =
    seed != null && ((round === 'champ_round_1' || round === 'toilet_round_1') || hasBye);
  const seedBadge = showSeedBadge ? (
    <span className="shrink-0 px-1 py-0.5 rounded bg-base-200 text-[0.55rem] md:text-[0.65rem] font-semibold text-base-content/70 leading-none whitespace-nowrap">
      <span className="md:hidden">{seed}</span>
      <span className="hidden md:inline">Seed {seed}</span>
    </span>
  ) : null;

  const renderPlaceholderRow = (label: string) => (
    <div className="py-1.5 md:py-2 max-w-full overflow-hidden min-w-0">
      <div className="flex justify-between items-start gap-2 min-w-0">
        <div className="flex items-center gap-1 md:gap-2 min-w-0">
          <div className="w-6 md:w-10 rounded-full bg-base-300/60" />
          {seedBadge}
        </div>
        {mode === 'score' && (
          <div className="flex flex-col items-end text-right leading-tight flex-shrink-0">
            <div className={SCORE_CLASS}>-</div>
            <div className="text-[0.6rem] md:text-xs text-base-content/60"></div>
          </div>
        )}
      </div>
      <div className="mt-1 min-w-0">
        <div className={`${TEAM_NAME_CLASS} truncate`}>{label}</div>
      </div>
    </div>
  );

  if (!pos) {
    return renderPlaceholderRow('TBD');
  }

  if (!team) {
    // BYE without a concrete team should still use the same visual layout
    if (pos.isBye) {
      return (
        <div className="py-1.5 md:py-2 max-w-full overflow-hidden min-w-0">
          {/* Top section: empty avatar space left, scores right */}
          <div className="flex justify-between items-start gap-2 min-w-0">
            {/* Empty avatar placeholder to keep layout consistent */}
            <div className="flex items-center gap-1 md:gap-2 min-w-0">
              <div className="w-6 md:w-10" />
            </div>

            {/* Scores on the right */}
            {mode === 'score' && (
              <div className="flex flex-col items-end text-right leading-tight flex-shrink-0">
                {/* Current week score */}
                <div className={SCORE_CLASS}>-</div>
              </div>
            )}
          </div>

          {/* Bottom row: BYE label across full width */}
          <div className="mt-1 min-w-0">
            <div className={`${TEAM_NAME_CLASS} truncate`}>BYE</div>
          </div>
        </div>
      );
    }

    // For non-BYE unknown teams, just show seed or TBD
    if (pos.seed != null) {
      return renderPlaceholderRow(`Seed ${pos.seed.toString()}`);
    }
      return renderPlaceholderRow('TBD');
  }

  const isBye = !!pos.isBye;
  const currentPoints = mode === 'score' ? pos.currentPoints : undefined;

  return (
    <div className="py-1.5 md:py-2 max-w-full overflow-hidden min-w-0">
      {/* Top section: avatar left, scores right */}
      <div className="flex justify-between items-start gap-2 min-w-0">
        {/* Avatar (top-left) */}
        <div className="flex items-center gap-1 md:gap-2 min-w-0">
          <TeamAvatars
            teamName={team.teamName}
            teamAvatarUrl={team.teamAvatarUrl}
            userAvatarUrl={team.userAvatarUrl}
            userDisplayName={team.ownerDisplayName}
            showUserAvatar={false}
            size="md"
            className="md:scale-125"
          />
          {seedBadge}
        </div>

        {/* Scores on the right */}
        {mode === 'score' && (
          <div className="flex flex-col items-end text-right leading-tight flex-shrink-0">
            {/* Current week score */}
            <div className={SCORE_CLASS}>
              {isBye
                ? '-'
                : currentPoints != null && currentPoints !== 0
                  ? currentPoints.toFixed(2)
                  : '-'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom row: team name across full width (or BYE) */}
      <div className="mt-1 min-w-0">
        <div className={`${TEAM_NAME_CLASS} truncate`} title={isBye ? undefined : team.teamName}>
          {isBye ? 'BYE' : team.teamName}
        </div>
      </div>
    </div>
  );
};

export const BracketTile: FC<BracketTileProps> = ({
  slot,
  teamsById,
  highlightTeamId,
  mode,
  titleOverride,
}) => {
  const involvesHighlight =
    highlightTeamId != null && slot.positions.some((pos) => pos?.teamId === highlightTeamId);
  const hasBye = slot.positions.some((pos) => pos?.isBye);

  const cardClassName = [
    'card card-compact bg-base-100 w-full max-w-full overflow-hidden border border-base-300',
    involvesHighlight ? 'ring-2 ring-primary shadow-lg' : 'shadow-sm',
  ].join(' ');

  const renderFront = (showReward: boolean) => (
    <div className={cardClassName}>
      <div className="card-body gap-1.5 p-2 md:p-3">
        <div className="divide-y divide-base-300">
          {slot.positions.map((pos, idx) => {
            const team = pos?.teamId != null ? teamsById.get(pos.teamId) : undefined;
            return (
              <TeamRow
                key={idx}
                team={team}
                pos={pos}
                mode={mode}
                round={slot.round}
                hasBye={hasBye}
              />
            );
          })}
        </div>

        {slot.rewardTitle && showReward && (
          <div className="mt-2 text-[0.7rem] hidden md:block border-t border-base-300 pt-2 max-w-full overflow-hidden">
            <div className="font-semibold text-base-content/90">{slot.rewardTitle}</div>
            <div className="text-base-content/70 text-[0.65rem]">{slot.rewardText}</div>
          </div>
        )}
      </div>
    </div>
  );

  const route = ROUTE_BY_FROM_ID.get(slot.id);
  const winnerDest = describeDestination(route?.winnerGoesTo);
  const loserDest = describeDestination(route?.loserGoesTo);
  const baseRoundLabel = ROUND_TITLES[slot.round] ?? cleanLabel(slot.label);
  const roundLabel =
    titleOverride ?? SLOT_TITLES[slot.id] ?? ROUND_TITLES[slot.round] ?? cleanLabel(slot.label);

  const renderBack = () => (
    <div className={cardClassName}>
      <div className="card-body gap-2 p-2 md:p-3">
        <div className="text-sm font-bold text-base-content">{slot.rewardTitle ?? roundLabel}</div>
        {hasBye ? (
          <div className="text-[0.7rem] text-base-content/70 leading-snug">
            {(() => {
              const byeIndex = slot.positions.findIndex((p) => p?.isBye);
              const teamLane = byeIndex === 0 ? 'bottom slot' : 'top slot';
              if (slot.bracketId === 'toilet') {
                return `Unlucky bye. Advance to ${baseRoundLabel} (${teamLane}) with no keeper shot.`;
              }
              return `You lucky dog. Advance to ${baseRoundLabel} (${teamLane}) without lifting a finger.`;
            })()}
          </div>
        ) : (
          <>
            {slot.rewardText && (
              <div className="text-[0.7rem] text-base-content/70 leading-snug">
                {slot.rewardText}
              </div>
            )}
            <div className="mt-1 space-y-1 text-[0.7rem] text-base-content/70">
              {winnerDest && (
                <div>
                  <span className="font-semibold text-base-content">Winner</span> → {winnerDest}
                </div>
              )}
              {loserDest && (
                <div>
                  <span className="font-semibold text-base-content">Loser</span> → {loserDest}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const isFlippable = FLIPPABLE_ROUNDS.has(slot.round);
  const showBack = isFlippable && mode === 'reward';

  if (!isFlippable) {
    return renderFront(mode === 'reward');
  }

  return (
    <div className="relative [perspective:1200px]">
      <div
        className="grid will-change-transform"
        style={{
          gridTemplateAreas: '"card"',
          transformStyle: 'preserve-3d',
          transition: 'transform 420ms ease',
          transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div style={{ gridArea: 'card', backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
          {renderFront(false)}
        </div>
        <div
          style={{ gridArea: 'card', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {renderBack()}
        </div>
      </div>
    </div>
  );
};
