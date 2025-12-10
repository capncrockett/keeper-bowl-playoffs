export type StoredMatchup = {
  week: number;
  team: string;
  opponent: string;
  pointsFor: number;
  pointsAgainst: number;
  margin: number;
  finished: boolean;
};

export type MatchupHistory = StoredMatchup[];
