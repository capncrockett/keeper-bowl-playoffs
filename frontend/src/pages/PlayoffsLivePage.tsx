import { useEffect, useMemo, useState } from 'react';
import {
  getLeagueRosters,
  getLeagueUsers,
  getWinnersBracket,
  getLosersBracket,
} from '../api/sleeper';
import { mergeRostersAndUsersToTeams, computeSeeds } from '../utils/sleeperTransforms';
import { toBracketGameOutcomes } from '../utils/sleeperPlayoffTransforms';
import type { Team } from '../models/fantasy';
import type { BracketSlot } from '../bracket/types';
import { BRACKET_TEMPLATE } from '../bracket/template';
import { assignSeedsToBracketSlots } from '../bracket/seedAssignment';
import { applyGameOutcomesToBracket } from '../bracket/state';
import { Bracket } from '../components/bracket/Bracket';

// TODO: unify with other pages later (config/env)
const LEAGUE_ID = '1251950356187840512';

type BracketMode = 'score' | 'reward';

export default function PlayoffsLivePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [slots, setSlots] = useState<BracketSlot[]>(BRACKET_TEMPLATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [mode, setMode] = useState<BracketMode>('score');

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [users, rosters, winnersBracket, losersBracket] = await Promise.all([
          getLeagueUsers(LEAGUE_ID),
          getLeagueRosters(LEAGUE_ID),
          getWinnersBracket(LEAGUE_ID),
          getLosersBracket(LEAGUE_ID),
        ]);

        // Build team data with seeds
        const merged = mergeRostersAndUsersToTeams(rosters, users);
        const withSeeds = computeSeeds(merged);
        setTeams(withSeeds);

        // Start with template and apply seed assignments
        let bracketSlots = assignSeedsToBracketSlots(withSeeds);

        // Convert Sleeper playoff matchups to game outcomes
        const outcomes = toBracketGameOutcomes(winnersBracket, losersBracket);

        // Apply outcomes to bracket using routing engine
        if (outcomes.length > 0) {
          bracketSlots = applyGameOutcomesToBracket(bracketSlots, outcomes);
        }

        setSlots(bracketSlots);
      } catch (err) {
        // eslint-disable-next-line no-console
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
              onClick={() => setMode('score')}
            >
              Score mode
            </button>
            <button
              type="button"
              className={`btn btn-xs sm:btn-sm join-item ${
                mode === 'reward' ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => setMode('reward')}
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
                {pvpInfo.selected.avatarUrl && (
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={pvpInfo.selected.avatarUrl} alt={pvpInfo.selected.teamName} />
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold">
                    {pvpInfo.selected.seed}. {pvpInfo.selected.teamName}
                  </div>
                  <div className="text-[0.7rem] text-base-content/60">
                    ({pvpInfo.selected.record.wins}-{pvpInfo.selected.record.losses}
                    {pvpInfo.selected.record.ties ? `-${pvpInfo.selected.record.ties}` : ''})
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold uppercase text-base-content/60">vs</span>

              {/* right: opponent */}
              {pvpInfo.opponent ? (
                <div className="flex items-center gap-2">
                  {pvpInfo.opponent.avatarUrl && (
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img src={pvpInfo.opponent.avatarUrl} alt={pvpInfo.opponent.teamName} />
                      </div>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {pvpInfo.opponent.seed}. {pvpInfo.opponent.teamName}
                    </div>
                    <div className="text-[0.7rem] text-base-content/60">
                      ({pvpInfo.opponent.record.wins}-{pvpInfo.opponent.record.losses}
                      {pvpInfo.opponent.record.ties ? `-${pvpInfo.opponent.record.ties}` : ''})
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
        <Bracket slots={slots} teams={teams} highlightTeamId={selectedTeamId} mode={mode} />
      )}
    </div>
  );
}
