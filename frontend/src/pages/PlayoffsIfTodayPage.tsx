// src/pages/PlayoffsIfTodayPage.tsx

import { useEffect, useMemo, useState } from 'react';
import { getLeagueRosters, getLeagueUsers } from '../api/sleeper';
import { mergeRostersAndUsersToTeams, computeSeeds } from '../utils/sleeperTransforms';
import type { Team } from '../models/fantasy';
import type { BracketSlot } from '../bracket/types';
import { BRACKET_TEMPLATE } from '../bracket/template';
import { assignSeedsToBracketSlots } from '../bracket/seedAssignment';
import { Bracket } from '../components/bracket/Bracket';

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">If the Season Ended Today</h1>
        <p className="text-sm text-base-content/60">
          Bracket preview using current Sleeper standings and seeds.
        </p>
      </div>

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

      {!isLoading && !error && teams.length > 0 && <Bracket slots={slots} teams={teams} />}
    </div>
  );
}

export default PlayoffsIfTodayPage;
