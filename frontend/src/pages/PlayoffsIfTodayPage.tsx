// src/pages/PlayoffsIfTodayPage.tsx

import { useEffect, useMemo, useState } from 'react';
import { getLeagueRosters, getLeagueUsers } from '../api/sleeper';
import { mergeRostersAndUsersToTeams, computeSeeds } from '../utils/sleeperTransforms';
import type { Team } from '../models/fantasy';
import type { BracketSlot } from '../bracket/types';
import { BRACKET_TEMPLATE } from '../bracket/template';
import { assignSeedsToBracketSlots } from '../bracket/seedAssignment';

// import { ROUTING_RULES } from '../bracket/routingRules';
// console.table(ROUTING_RULES);

// TODO: unify with other pages later (config/env)
const LEAGUE_ID = '1251950356187840512';

function PlayoffsIfTodayPage() {
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
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  const slots: BracketSlot[] = useMemo(
    () => (teams.length > 0 ? assignSeedsToBracketSlots(teams) : BRACKET_TEMPLATE),
    [teams],
  );

  const teamById = useMemo(() => {
    const map = new Map<number, Team>();
    teams.forEach((team) => {
      map.set(team.sleeperRosterId, team);
    });
    return map;
  }, [teams]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">If the Season Ended Today</h1>
      <p className="text-sm text-base-content/60 mb-4">
        Bracket preview using current Sleeper standings and seeds.
      </p>

      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {error && !isLoading && (
        <div className="alert alert-error mb-4">
          <span>Failed to load playoff preview: {error}</span>
        </div>
      )}

      {!isLoading && !error && teams.length === 0 && (
        <p className="text-sm text-base-content/60">No teams found.</p>
      )}

      {!isLoading && !error && teams.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {slots.map((slot) => (
            <div key={slot.id} className="card bg-base-200 shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title text-sm">{slot.label}</h2>
                <p className="text-xs text-base-content/60">
                  {slot.bracketId.toUpperCase()} • {slot.round}
                </p>

                <ul className="mt-2 text-xs space-y-1">
                  {slot.positions.map((pos, idx) => {
                    if (!pos) {
                      return (
                        <li key={idx} className="italic text-base-content/60">
                          TBD
                        </li>
                      );
                    }

                    const team = pos.teamId != null ? teamById.get(pos.teamId) : undefined;

                    if (team) {
                      return (
                        <li key={idx}>
                          <div className="flex items-center gap-2">
                            {team.avatarUrl && (
                              <div className="avatar">
                                <div className="w-6 rounded-full">
                                  <img src={team.avatarUrl} alt={team.teamName} />
                                </div>
                              </div>
                            )}
                            <span className="font-semibold">
                              {team.seed}. {team.teamName}
                            </span>
                            <span className="text-base-content/60">
                              ({team.record.wins}-{team.record.losses}
                              {team.record.ties ? `-${team.record.ties}` : ''})
                            </span>
                          </div>
                        </li>
                      );
                    }

                    if (pos.seed != null) {
                      return <li key={idx}>Seed {pos.seed}</li>;
                    }

                    if (pos.isBye) {
                      return (
                        <li key={idx} className="italic text-base-content/60">
                          BYE
                        </li>
                      );
                    }

                    return (
                      <li key={idx} className="italic text-base-content/60">
                        TBD
                      </li>
                    );
                  })}
                </ul>

                {slot.rewardTitle ? (
                  <div className="mt-2 text-[0.7rem]">
                    <div className="font-semibold">{slot.rewardTitle}</div>
                    <div className="text-base-content/70">{slot.rewardText}</div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayoffsIfTodayPage;
