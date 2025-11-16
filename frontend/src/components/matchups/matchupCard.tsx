// frontend/src/components/matchups/MatchupCard.tsx

import type { LiveMatchData, Team } from '../../models/fantasy';

interface MatchupCardProps {
  live: LiveMatchData;
  teamA: Team | undefined;
  teamB: Team | undefined;
}

export function MatchupCard({ live, teamA, teamB }: MatchupCardProps) {
  const totalWinProb = live.winProbA + live.winProbB || 1;

  const winPctA = Math.round((live.winProbA / totalWinProb) * 100);
  const winPctB = Math.round((live.winProbB / totalWinProb) * 100);

  return (
    <div className="card bg-base-200 shadow-md mb-4">
      <div className="card-body p-4 gap-3">
        {/* Header: week / matchup label */}
        <div className="flex justify-between items-center text-xs text-base-content/60">
          <span>Week {live.week}</span>
          <span>
            Matchup #{live.teamIdA}-{live.teamIdB ?? 'BYE'}
          </span>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-2 gap-3">
          {/* Team A */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {teamA?.avatarUrl && (
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={teamA.avatarUrl} alt={teamA.teamName} />
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold truncate">{teamA?.teamName ?? 'Unknown'}</span>
                <span className="text-xs text-base-content/60">
                  {teamA
                    ? `${teamA.record.wins}-${teamA.record.losses}${
                        teamA.record.ties ? `-${teamA.record.ties}` : ''
                      }`
                    : '-'}
                </span>
              </div>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-bold">
                {live.pointsA ? live.pointsA.toFixed(1) : '-'}
              </div>
              <div className="text-xs text-base-content/60">
                Proj: {live.projectedA.toFixed(1)} • Win: {winPctA}%
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col gap-1 items-end text-right">
            <div className="flex items-center gap-2 flex-row-reverse">
              {teamB?.avatarUrl && (
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={teamB.avatarUrl} alt={teamB.teamName} />
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold truncate">{teamB?.teamName ?? 'BYE'}</span>
                <span className="text-xs text-base-content/60">
                  {teamB
                    ? `${teamB.record.wins}-${teamB.record.losses}${
                        teamB.record.ties ? `-${teamB.record.ties}` : ''
                      }`
                    : '-'}
                </span>
              </div>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-bold">{teamB ? live.pointsB.toFixed(1) : '-'}</div>
              <div className="text-xs text-base-content/60">
                Proj: {live.projectedB.toFixed(1)} • Win: {winPctB}%
              </div>
            </div>
          </div>
        </div>

        {/* Win % bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1 text-base-content/60">
            <span>{teamA?.teamName ?? 'Team A'}</span>
            <span>{teamB?.teamName ?? 'Team B'}</span>
          </div>
          <div className="flex w-full h-2 overflow-hidden rounded-full bg-base-300">
            <div className="bg-primary" style={{ width: `${winPctA}%` }} />
            <div className="bg-secondary" style={{ width: `${winPctB}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
