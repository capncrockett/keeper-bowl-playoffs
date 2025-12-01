// src/pages/StandingsPage.tsx

import { useEffect, useState } from 'react';
import { getLeague, getLeagueRosters, getLeagueUsers } from '../api/sleeper';
import { mergeRostersAndUsersToTeams, computeSeeds } from '../utils/sleeperTransforms';
import type { Team } from '../models/fantasy';
import { TeamAvatars } from '../components/common/TeamAvatars';

// TODO: unify with other pages later (config/env)
const LEAGUE_ID = '1251950356187840512';

export function StandingsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const [league, users, rosters] = await Promise.all([
          getLeague(LEAGUE_ID),
          getLeagueUsers(LEAGUE_ID),
          getLeagueRosters(LEAGUE_ID),
        ]);

        const merged = mergeRostersAndUsersToTeams(rosters, users, league);
        const withSeeds = computeSeeds(merged);

        setTeams(withSeeds);
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

  const insights =
    teams.length > 0
      ? (() => {
          const pfSorted = [...teams].sort((a, b) => b.pointsFor - a.pointsFor);
          const pfRankByRosterId = new Map<number, number>(
            pfSorted.map((team, index) => [team.sleeperRosterId, index + 1]),
          );

          const derived = teams.map((team) => {
            const gamesPlayed = team.record.wins + team.record.losses + team.record.ties;
            const pfPerGame = gamesPlayed > 0 ? team.pointsFor / gamesPlayed : 0;
            const paPerGame = gamesPlayed > 0 ? team.pointsAgainst / gamesPlayed : 0;
            const pfRank = pfRankByRosterId.get(team.sleeperRosterId) ?? teams.length;
            const standingRank = team.seed ?? team.rank;
            const fortuneScore = pfRank - standingRank; // positive: record outpaces PF, negative: unlucky

            return {
              ...team,
              gamesPlayed,
              pfPerGame,
              paPerGame,
              pfRank,
              standingRank,
              fortuneScore,
            };
          });

          const leagueAvgPaPerGame =
            derived.reduce((sum, team) => sum + team.paPerGame, 0) / derived.length;

          const toughestSchedule = derived.reduce((prev, curr) =>
            curr.paPerGame > prev.paPerGame ? curr : prev,
          );
          const easiestSchedule = derived.reduce((prev, curr) =>
            curr.paPerGame < prev.paPerGame ? curr : prev,
          );
          const luckiestRecord = derived.reduce((prev, curr) =>
            curr.fortuneScore > prev.fortuneScore ? curr : prev,
          );
          const unluckiestRecord = derived.reduce((prev, curr) =>
            curr.fortuneScore < prev.fortuneScore ? curr : prev,
          );

          const hasDivisionData = derived.some(
            (team) => team.divisionId !== null && team.divisionId !== undefined,
          );

          const divisionBuckets = hasDivisionData
            ? derived.reduce((map, team) => {
                const key = team.divisionId ?? -1;
                const current = map.get(key);
                if (current) {
                  current.push(team);
                } else {
                  map.set(key, [team]);
                }
                return map;
              }, new Map<number, (typeof derived)[number][]>())
            : new Map<number, (typeof derived)[number][]>();

          const divisionStats = Array.from(divisionBuckets.entries()).map(
            ([divisionId, members]) => {
              const avgPfPerGame =
                members.reduce((sum, team) => sum + team.pfPerGame, 0) / members.length;
              const avgPaPerGame =
                members.reduce((sum, team) => sum + team.paPerGame, 0) / members.length;
              const topSeed = members.reduce((prev, curr) =>
                curr.standingRank < prev.standingRank ? curr : prev,
              );
              const divisionName =
                members[0]?.divisionName ??
                (divisionId === -1 ? 'Unassigned division' : `Division ${divisionId}`);
              const divisionAvatarUrl = members[0]?.divisionAvatarUrl ?? null;

              return {
                divisionId,
                divisionName,
                divisionAvatarUrl,
                members,
                avgPfPerGame,
                avgPaPerGame,
                topSeed,
              };
            },
          );

          const highestAvgPfDivision =
            divisionStats.length > 0
              ? divisionStats.reduce((prev, curr) =>
                  curr.avgPfPerGame > prev.avgPfPerGame ? curr : prev,
                )
              : null;
          const lowestAvgPaDivision =
            divisionStats.length > 0
              ? divisionStats.reduce((prev, curr) =>
                  curr.avgPaPerGame < prev.avgPaPerGame ? curr : prev,
                )
              : null;

          return {
            derived,
            leagueAvgPaPerGame,
            toughestSchedule,
            easiestSchedule,
            luckiestRecord,
            unluckiestRecord,
            divisionStats,
            highestAvgPfDivision,
            lowestAvgPaDivision,
            hasDivisionData,
          };
        })()
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">Standings</h1>
      <p className="text-sm text-base-content/60 mb-4">
        Live seeds derived from Sleeper rosters and records.
      </p>

      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {error && !isLoading && (
        <div className="alert alert-error mb-4">
          <span>Failed to load standings: {error}</span>
        </div>
      )}

      {!isLoading && !error && teams.length === 0 && (
        <p className="text-sm text-base-content/60">No teams found.</p>
      )}

      {!isLoading && !error && teams.length > 0 && (
        <>
          {insights && (
            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">Toughest Schedule (PA)</h3>
                  <p className="text-sm">
                    {insights.toughestSchedule.teamName} is eating{' '}
                    {insights.toughestSchedule.paPerGame.toFixed(1)} PA per week (league avg{' '}
                    {insights.leagueAvgPaPerGame.toFixed(1)}).
                  </p>
                </div>
              </div>
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">Easiest Schedule (PA)</h3>
                  <p className="text-sm">
                    {insights.easiestSchedule.teamName} sees only{' '}
                    {insights.easiestSchedule.paPerGame.toFixed(1)} PA per week.
                  </p>
                </div>
              </div>
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">Luckiest Record</h3>
                  <p className="text-sm">
                    {insights.luckiestRecord.teamName} is seeded #
                    {insights.luckiestRecord.standingRank} but sits #
                    {insights.luckiestRecord.pfRank} in PF (diff{' '}
                    {insights.luckiestRecord.fortuneScore}). Low PA and timing are doing work.
                  </p>
                </div>
              </div>
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">Unluckiest Record</h3>
                  <p className="text-sm">
                    {insights.unluckiestRecord.teamName} owns #{insights.unluckiestRecord.pfRank} PF
                    but is seeded #{insights.unluckiestRecord.standingRank} (diff{' '}
                    {insights.unluckiestRecord.fortuneScore}). Running into weekly hammers.
                  </p>
                </div>
              </div>
            </div>
          )}
          {insights?.hasDivisionData ? (
            <>
              <div className="grid gap-3 md:grid-cols-2 mb-4">
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm">Highest-Scoring Division</h3>
                    <div className="text-sm inline-flex items-center gap-2">
                      <span>
                        {insights.highestAvgPfDivision?.divisionName ?? 'Division unknown'} is
                        averaging {insights.highestAvgPfDivision?.avgPfPerGame.toFixed(1) ?? '—'} PF
                        per week; top seed is{' '}
                        {insights.highestAvgPfDivision?.topSeed.teamName ?? '—'}.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm">Softest Division (PA)</h3>
                    <div className="text-sm inline-flex items-center gap-2">
                      <span>
                        {insights.lowestAvgPaDivision?.divisionName ?? 'Division unknown'} is seeing
                        only {insights.lowestAvgPaDivision?.avgPaPerGame.toFixed(1) ?? '—'} PA per
                        week.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto mb-6">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Division</th>
                      <th>Teams</th>
                      <th>Avg PF/Week</th>
                      <th>Avg PA/Week</th>
                      <th>Top Seed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.divisionStats.map((div) => (
                      <tr key={div.divisionId}>
                        <td>
                          {div.divisionAvatarUrl ? (
                            <div className="avatar">
                              <div className="w-8 rounded">
                                <img
                                  src={div.divisionAvatarUrl}
                                  alt={div.divisionName ?? 'Division avatar'}
                                />
                              </div>
                            </div>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{div.divisionName}</td>
                        <td>{div.members.length}</td>
                        <td>{div.avgPfPerGame.toFixed(1)}</td>
                        <td>{div.avgPaPerGame.toFixed(1)}</td>
                        <td>
                          #{div.topSeed.standingRank} {div.topSeed.teamName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="alert alert-warning mb-4">
              <span>
                Division data unavailable from Sleeper for this league (no division IDs/names
                found).
              </span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Seed</th>
                  <th>Team</th>
                  <th>Owner</th>
                  <th>Record</th>
                  <th>Points For</th>
                  <th>Points Against</th>
                  <th>Avg PF/Week</th>
                  <th>PF:PA</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const gamesPlayed = team.record.wins + team.record.losses + team.record.ties;
                  const avgPoints = gamesPlayed > 0 ? team.pointsFor / gamesPlayed : 0;
                  const pfPaRatio =
                    team.pointsAgainst > 0 ? team.pointsFor / team.pointsAgainst : null;

                  return (
                    <tr key={team.sleeperRosterId}>
                      <td className="font-semibold">{team.seed ?? team.rank}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <TeamAvatars
                            teamName={team.teamName}
                            teamAvatarUrl={team.teamAvatarUrl}
                            userAvatarUrl={team.userAvatarUrl}
                            userDisplayName={team.ownerDisplayName}
                            size="md"
                          />
                          <span>{team.teamName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {team.userAvatarUrl && (
                            <div className="avatar">
                              <div className="w-8 rounded-full">
                                <img src={team.userAvatarUrl} alt={team.ownerDisplayName} />
                              </div>
                            </div>
                          )}
                          <span>{team.ownerDisplayName}</span>
                        </div>
                      </td>
                      <td>
                        {team.record.wins}-{team.record.losses}
                        {team.record.ties ? `-${team.record.ties}` : ''}
                      </td>
                      <td>{team.pointsFor.toFixed(2)}</td>
                      <td>{team.pointsAgainst.toFixed(2)}</td>
                      <td>{avgPoints.toFixed(2)}</td>
                      <td>{pfPaRatio !== null ? pfPaRatio.toFixed(2) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
