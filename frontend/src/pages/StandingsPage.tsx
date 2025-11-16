// src/pages/StandingsPage.tsx

import { useEffect, useState } from 'react';
import { getLeagueRosters, getLeagueUsers } from '../api/sleeper';
import { mergeRostersAndUsersToTeams, computeSeeds } from '../utils/sleeperTransforms';
import type { Team } from '../models/fantasy';

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

        const [users, rosters] = await Promise.all([
          getLeagueUsers(LEAGUE_ID),
          getLeagueRosters(LEAGUE_ID),
        ]);

        const merged = mergeRostersAndUsersToTeams(rosters, users);
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
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.sleeperRosterId}>
                  <td className="font-semibold">{team.seed ?? team.rank}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {team.avatarUrl && (
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img src={team.avatarUrl} alt={team.teamName} />
                          </div>
                        </div>
                      )}
                      <span>{team.teamName}</span>
                    </div>
                  </td>
                  <td>{team.ownerDisplayName}</td>
                  <td>
                    {team.record.wins}-{team.record.losses}
                    {team.record.ties ? `-${team.record.ties}` : ''}
                  </td>
                  <td>{team.pointsFor.toFixed(2)}</td>
                  <td>{team.pointsAgainst.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
