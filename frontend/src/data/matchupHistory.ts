export type StoredMatchup = {
  week: number;
  team: string;
  opponent: string;
  pointsFor: number;
  pointsAgainst: number;
  margin: number;
  finished: boolean;
};

// Snapshot of Week 14 results (regular season finale), stored in a flat, table-like shape
// to mirror what we would persist in a SQLite table. Positive margin means a win.
export const MATCHUP_HISTORY: StoredMatchup[] = [
  {
    week: 14,
    team: 'Glaurung & Foes',
    opponent: 'Ravens Win Super Bowl LX!',
    pointsFor: 111.24,
    pointsAgainst: 95.04,
    margin: 16.2,
    finished: true,
  },
  {
    week: 14,
    team: 'Ravens Win Super Bowl LX!',
    opponent: 'Glaurung & Foes',
    pointsFor: 95.04,
    pointsAgainst: 111.24,
    margin: -16.2,
    finished: true,
  },
  {
    week: 14,
    team: 'There Goes Nabers’ Hood 😭',
    opponent: 'Bo Derek Henry V',
    pointsFor: 112.0,
    pointsAgainst: 142.66,
    margin: -30.66,
    finished: true,
  },
  {
    week: 14,
    team: 'Bo Derek Henry V',
    opponent: 'There Goes Nabers’ Hood 😭',
    pointsFor: 142.66,
    pointsAgainst: 112.0,
    margin: 30.66,
    finished: true,
  },
  {
    week: 14,
    team: 'The Dudes From Cocoon',
    opponent: 'Kitchen Chubbards',
    pointsFor: 118.86,
    pointsAgainst: 54.7,
    margin: 64.16,
    finished: true,
  },
  {
    week: 14,
    team: 'Kitchen Chubbards',
    opponent: 'The Dudes From Cocoon',
    pointsFor: 54.7,
    pointsAgainst: 118.86,
    margin: -64.16,
    finished: true,
  },
  {
    week: 14,
    team: "Big Ol' TDs",
    opponent: 'Seahawgs',
    pointsFor: 112.86,
    pointsAgainst: 131.44,
    margin: -18.58,
    finished: true,
  },
  {
    week: 14,
    team: 'Seahawgs',
    opponent: "Big Ol' TDs",
    pointsFor: 131.44,
    pointsAgainst: 112.86,
    margin: 18.58,
    finished: true,
  },
  {
    week: 14,
    team: '5 Fingers 2 Ur Face',
    opponent: 'Lux73lip',
    pointsFor: 112.94,
    pointsAgainst: 109.58,
    margin: 3.36,
    finished: true,
  },
  {
    week: 14,
    team: 'Lux73lip',
    opponent: '5 Fingers 2 Ur Face',
    pointsFor: 109.58,
    pointsAgainst: 112.94,
    margin: -3.36,
    finished: true,
  },
  {
    week: 14,
    team: 'Inappropriate touchdowns',
    opponent: "Skeletrex's Bone Brigade",
    pointsFor: 125.94,
    pointsAgainst: 84.24,
    margin: 41.7,
    finished: true,
  },
  {
    week: 14,
    team: "Skeletrex's Bone Brigade",
    opponent: 'Inappropriate touchdowns',
    pointsFor: 84.24,
    pointsAgainst: 125.94,
    margin: -41.7,
    finished: true,
  },
];

// Convenience helper: get margins keyed by team for a given week.
export function getMatchupMarginsForWeek(week: number): Map<string, number> {
  const margins = new Map<string, number>();
  const normalize = (name: string) => name.replace(/’/g, "'").toLowerCase();

  MATCHUP_HISTORY.filter((m) => m.week === week).forEach((m) => {
    margins.set(m.team, m.margin);
    margins.set(normalize(m.team), m.margin);
  });
  return margins;
}
