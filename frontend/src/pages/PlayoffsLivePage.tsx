import { useEffect, useMemo, useState } from 'react';
import {
  getLeagueRosters,
  getLeagueUsers,
  getNFLState,
  getLeagueMatchupsForWeek,
} from '../api/sleeper';
import { mergeRostersAndUsersToTeams, computeSeeds } from '../utils/sleeperTransforms';
import { applyMatchupScoresToBracket } from '../utils/applyMatchupScores';
import type { Team } from '../models/fantasy';
import type { BracketSlot, BracketSlotId } from '../bracket/types';
import { BRACKET_TEMPLATE } from '../bracket/template';
import { assignSeedsToBracketSlots } from '../bracket/seedAssignment';
import { applyGameOutcomesToBracket } from '../bracket/state';
import { Bracket } from '../components/bracket/Bracket';
import { TeamAvatars } from '../components/common/TeamAvatars';

// TODO: unify with other pages later (config/env)
const LEAGUE_ID = '1251950356187840512';
const PLAYOFF_WEEKS = {
  round1: 15,
  round2: 16,
  finals: 17,
} as const;

const ROUND_1_ROUNDS: BracketSlot['round'][] = ['champ_round_1', 'toilet_round_1'];
const ROUND_2_ROUNDS: BracketSlot['round'][] = [
  'champ_round_2',
  'toilet_round_2',
  'keeper_main',
];
const FINALS_ROUNDS: BracketSlot['round'][] = [
  'champ_finals',
  'champ_misc',
  'toilet_finals',
  'toilet_misc',
  'keeper_misc',
];

const ROUND_1_SLOT_IDS: BracketSlotId[] = [
  'champ_r1_g1',
  'champ_r1_g2',
  'toilet_r1_g1',
  'toilet_r1_g2',
];

const ROUND_2_SLOT_IDS: BracketSlotId[] = [
  'champ_r2_g1',
  'champ_r2_g2',
  'toilet_r2_g1',
  'toilet_r2_g2',
];

const KEEPER_ROUND_2_SLOT_IDS: BracketSlotId[] = [
  'keeper_splashback1',
  'keeper_splashback2',
];

type BracketMode = 'score' | 'reward';

const formatRecord = (record: Team['record']): string => {
  const base = `${record.wins.toString()}-${record.losses.toString()}`;
  return record.ties ? `${base}-${record.ties.toString()}` : base;
};

const resolveRoundOutcomes = (
  slots: BracketSlot[],
  slotIds: BracketSlotId[],
  teamsById: Map<number, Team>,
): BracketSlot[] => {
  const slotById = new Map<BracketSlotId, BracketSlot>();
  slots.forEach((slot) => slotById.set(slot.id, slot));

  const outcomes = slotIds.flatMap((slotId) => {
    const slot = slotById.get(slotId);
    if (!slot) return [];

    const [posA, posB] = slot.positions;
    if (!posA?.teamId || !posB?.teamId) return [];
    if (posA.currentPoints == null || posB.currentPoints == null) return [];

    if (posA.currentPoints > posB.currentPoints) {
      return [{ slotId, winnerIndex: 0 as const }];
    }
    if (posB.currentPoints > posA.currentPoints) {
      return [{ slotId, winnerIndex: 1 as const }];
    }

    const seedA = posA.seed ?? teamsById.get(posA.teamId)?.seed;
    const seedB = posB.seed ?? teamsById.get(posB.teamId)?.seed;
    if (seedA != null && seedB != null && seedA !== seedB) {
      return [{ slotId, winnerIndex: seedA < seedB ? (0 as const) : (1 as const) }];
    }

    return [{ slotId, winnerIndex: 0 as const }];
  });

  return outcomes.length > 0 ? applyGameOutcomesToBracket(slots, outcomes) : slots;
};

export default function PlayoffsLivePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [slots, setSlots] = useState<BracketSlot[]>(BRACKET_TEMPLATE);
  const [byeWeekPointsByTeamId, setByeWeekPointsByTeamId] = useState<Map<number, number> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [mode, setMode] = useState<BracketMode>('score');

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        setByeWeekPointsByTeamId(null);

        // Fetch all required data in parallel
        const [users, rosters, nflState, round1Matchups, round2Matchups, finalsMatchups] =
          await Promise.all([
            getLeagueUsers(LEAGUE_ID),
            getLeagueRosters(LEAGUE_ID),
            getNFLState(),
            getLeagueMatchupsForWeek(LEAGUE_ID, PLAYOFF_WEEKS.round1),
            getLeagueMatchupsForWeek(LEAGUE_ID, PLAYOFF_WEEKS.round2),
            getLeagueMatchupsForWeek(LEAGUE_ID, PLAYOFF_WEEKS.finals),
          ]);

        // Build team data with seeds
        const merged = mergeRostersAndUsersToTeams(rosters, users);
        const withSeeds = computeSeeds(merged);
        setTeams(withSeeds);
        const teamsById = new Map<number, Team>();
        withSeeds.forEach((team) => {
          teamsById.set(team.sleeperRosterId, team);
        });

        const byeWeekPoints = new Map<number, number>();
        round1Matchups.forEach((matchup) => {
          byeWeekPoints.set(matchup.roster_id, matchup.points);
        });
        setByeWeekPointsByTeamId(byeWeekPoints);

        // Start with template and apply seed assignments
        let bracketSlots = assignSeedsToBracketSlots(withSeeds);

        // Apply matchup scores by playoff week
        const currentWeek = nflState.display_week;

        bracketSlots = applyMatchupScoresToBracket(bracketSlots, round1Matchups, {
          rounds: ROUND_1_ROUNDS,
        });
        if (currentWeek >= PLAYOFF_WEEKS.round1) {
          bracketSlots = resolveRoundOutcomes(bracketSlots, ROUND_1_SLOT_IDS, teamsById);
        }

        bracketSlots = applyMatchupScoresToBracket(bracketSlots, round2Matchups, {
          rounds: ROUND_2_ROUNDS,
        });
        if (currentWeek >= PLAYOFF_WEEKS.finals) {
          bracketSlots = resolveRoundOutcomes(bracketSlots, KEEPER_ROUND_2_SLOT_IDS, teamsById);
          bracketSlots = resolveRoundOutcomes(bracketSlots, ROUND_2_SLOT_IDS, teamsById);
        }

        bracketSlots = applyMatchupScoresToBracket(bracketSlots, finalsMatchups, {
          rounds: FINALS_ROUNDS,
        });

        setSlots(bracketSlots);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  const teamsById = useMemo(() => {
    const map = new Map<number, Team>();
    teams.forEach((t) => map.set(t.sleeperRosterId, t));
    return map;
  }, [teams]);

  const pvpInfo = useMemo(() => {
    if (!selectedTeamId) return null;

    const selected = teamsById.get(selectedTeamId);
    if (!selected) return null;

    const slot = slots.find((s) => s.positions.some((p) => p?.teamId === selectedTeamId));
    if (!slot) {
      return { selected, opponent: null, slot: null };
    }

    const otherPos = slot.positions.find((p) => p && p.teamId !== selectedTeamId);
    const opponent =
      otherPos && otherPos.teamId != null ? (teamsById.get(otherPos.teamId) ?? null) : null;

    return { selected, opponent, slot };
  }, [selectedTeamId, teamsById, slots]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Playoffs</h1>
          <p className="text-sm text-base-content/60">
            Real-time playoff bracket with live results from Sleeper.
          </p>
        </div>

        {/* controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* mode toggle */}
          <div className="join">
            <button
              type="button"
              className={`btn btn-xs sm:btn-sm join-item ${
                mode === 'score' ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => {
                setMode('score');
              }}
            >
              Score mode
            </button>
            <button
              type="button"
              className={`btn btn-xs sm:btn-sm join-item ${
                mode === 'reward' ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => {
                setMode('reward');
              }}
            >
              Reward mode
            </button>
          </div>

          {/* team selector */}
          <select
            className="select select-xs sm:select-sm w-40"
            value={selectedTeamId ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedTeamId(value ? Number(value) : null);
            }}
          >
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team.sleeperRosterId} value={team.sleeperRosterId}>
                {team.seed}. {team.teamName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pvpInfo && (
        <div className="card bg-base-200 shadow-md">
          <div className="card-body gap-3">
            <div className="text-xs font-semibold uppercase text-base-content/60">Head-to-head</div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              {/* left: selected team */}
              <div className="flex items-center gap-2">
                <TeamAvatars
                  teamName={pvpInfo.selected.teamName}
                  teamAvatarUrl={pvpInfo.selected.teamAvatarUrl}
                  userAvatarUrl={pvpInfo.selected.userAvatarUrl}
                  userDisplayName={pvpInfo.selected.ownerDisplayName}
                  showUserAvatar={false}
                  size="md"
                />
                <div>
                  <div className="text-sm font-semibold">
                    {pvpInfo.selected.seed}. {pvpInfo.selected.teamName}
                  </div>
                  <div className="text-[0.7rem] text-base-content/60">
                    ({formatRecord(pvpInfo.selected.record)})
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold uppercase text-base-content/60">vs</span>

              {/* right: opponent */}
              {pvpInfo.opponent ? (
                <div className="flex items-center gap-2">
                  <TeamAvatars
                    teamName={pvpInfo.opponent.teamName}
                    teamAvatarUrl={pvpInfo.opponent.teamAvatarUrl}
                    userAvatarUrl={pvpInfo.opponent.userAvatarUrl}
                    userDisplayName={pvpInfo.opponent.ownerDisplayName}
                    showUserAvatar={false}
                    size="md"
                  />
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {pvpInfo.opponent.seed}. {pvpInfo.opponent.teamName}
                    </div>
                    <div className="text-[0.7rem] text-base-content/60">
                      ({formatRecord(pvpInfo.opponent.record)})
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[0.7rem] italic text-base-content/60">Opponent TBD</div>
              )}
            </div>

            {pvpInfo.slot && (
              <div className="text-[0.7rem] text-base-content/60">{pvpInfo.slot.label}</div>
            )}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {error && !isLoading && (
        <div className="alert alert-error mb-4">
          <span>Failed to load live playoffs: {error}</span>
        </div>
      )}

      {!isLoading && !error && teams.length === 0 && (
        <p className="text-sm text-base-content/60">No teams found.</p>
      )}

      {!isLoading && !error && teams.length > 0 && (
        <Bracket
          slots={slots}
          teams={teams}
          highlightTeamId={selectedTeamId}
          mode={mode}
          byeWeekPointsByTeamId={byeWeekPointsByTeamId}
        />
      )}
    </div>
  );
}
