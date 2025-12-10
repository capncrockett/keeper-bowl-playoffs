import {
  findMatchupForTeam,
  getLatestCompletedWeek,
  getMatchupMarginsForWeek,
  MATCHUP_HISTORY,
} from './matchupHistory';
import type { StoredMatchup } from './matchupHistoryTypes';

describe('matchupHistory store', () => {
  it('normalizes names when building margins', () => {
    const margins = getMatchupMarginsForWeek(14);
    expect(margins.get("Big Ol' TDs")).toBeDefined();
    expect(margins.get("big ol' tds")).toEqual(margins.get("Big Ol' TDs"));
  });

  it('finds matchups by week and falls back to earliest entry', () => {
    const sample: StoredMatchup[] = [
      {
        week: 1,
        team: 'Alpha',
        opponent: 'Beta',
        pointsFor: 100,
        pointsAgainst: 90,
        margin: 10,
        finished: true,
      },
      {
        week: 2,
        team: 'Gamma',
        opponent: 'Beta',
        pointsFor: 101,
        pointsAgainst: 110,
        margin: -9,
        finished: true,
      },
      {
        week: 1,
        team: 'Beta',
        opponent: 'Alpha',
        pointsFor: 90,
        pointsAgainst: 100,
        margin: -10,
        finished: true,
      },
      {
        week: 2,
        team: 'Beta',
        opponent: 'Gamma',
        pointsFor: 110,
        pointsAgainst: 101,
        margin: 9,
        finished: true,
      },
    ];

    expect(findMatchupForTeam('beta', { week: 1, matchups: sample })?.opponent).toBe('Alpha');
    expect(findMatchupForTeam('beta', { matchups: sample })?.week).toBe(1);
  });

  it('ignores unfinished weeks when determining latest completed week', () => {
    const unfinishedWeek: StoredMatchup[] = [
      ...MATCHUP_HISTORY,
      {
        week: 15,
        team: 'Alpha',
        opponent: 'Beta',
        pointsFor: 100,
        pointsAgainst: 90,
        margin: 10,
        finished: false,
      },
      {
        week: 15,
        team: 'Beta',
        opponent: 'Alpha',
        pointsFor: 90,
        pointsAgainst: 100,
        margin: -10,
        finished: false,
      },
    ];

    expect(getLatestCompletedWeek(unfinishedWeek)).toBe(14);

    const completedWeek = unfinishedWeek.map((matchup) =>
      matchup.week === 15 ? { ...matchup, finished: true } : matchup,
    );
    expect(getLatestCompletedWeek(completedWeek)).toBe(15);
  });
});
