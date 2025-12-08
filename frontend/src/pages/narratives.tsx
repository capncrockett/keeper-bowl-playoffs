import { type ReactNode } from 'react';
import type { Team } from '../models/fantasy';
import { computePlayoffRaceInsights, gamesBack } from './playoffRaceInsights';

type NarrativeSection = {
  id?: string;
  heading: string;
  summary: ReactNode;
  scenarios: ReactNode[];
  note?: ReactNode;
};

export type PlayoffNarratives = {
  bubble: NarrativeSection | null;
  bye: NarrativeSection | null;
  divisions: NarrativeSection[];
};

export type GlossaryEntry = {
  code: string;
  description: string;
  example?: string;
};

export const STANDINGS_GLOSSARY: GlossaryEntry[] = [
  { code: 'x', description: 'Clinched Playoffs' },
  { code: 'y', description: 'Clinched Division' },
  { code: 'z', description: 'Clinched First-Round Bye' },
  { code: '*', description: 'Clinched No. 1 Overall Seed' },
  { code: 'e', description: 'Eliminated From Playoff Contention' },
  {
    code: 'c6',
    description:
      'Currently holds the "Clutch Rule" 6th seed (highest PF among non-division-winners)',
  },
  {
    code: 'm',
    description: 'Mathematically in play: can still move up or down based on Best/Worst Seed range',
  },
  {
    code: 'bw',
    description:
      'Best/Worst range showing the highest and lowest possible seed (e.g., 3-8, 1-4, 1-1)',
  },
];

const seedToken = (team: Team): ReactNode => {
  const seed = team.seed ?? team.rank;
  return (
    <>
      ({seed}) <strong>{team.teamName}</strong>
    </>
  );
};

const boldName = (team: Team): ReactNode => <strong>{team.teamName}</strong>;

const leagueAvgPfPerGame = (teams: Team[]): number => {
  const withGames = teams
    .map((team) => ({
      games: team.record.wins + team.record.losses + team.record.ties,
      pf: team.pointsFor,
    }))
    .filter((entry) => entry.games > 0);

  if (!withGames.length) return 0;

  const total = withGames.reduce((sum, entry) => sum + entry.pf / entry.games, 0);
  return total / withGames.length;
};

const pfSwingNeeded = (leader: Team, chaser: Team): number => {
  const gap = leader.pointsFor - chaser.pointsFor;
  const rounded = Math.abs(gap);
  return Number(rounded.toFixed(1));
};

type RecordGap = {
  leader: Team | null;
  trailer: Team | null;
  games: number;
};

const recordLead = (a: Team, b: Team): RecordGap => {
  const gap = gamesBack(a, b);
  if (gap > 0) {
    return { leader: a, trailer: b, games: gap };
  }
  if (gap < 0) {
    return { leader: b, trailer: a, games: Math.abs(gap) };
  }
  return { leader: null, trailer: null, games: 0 };
};

const findBubbleThirdTeam = (
  teams: Team[],
  cutoff: Team,
  challenger: Team,
  avgPf: number,
): Team | null => {
  const seeded = teams
    .filter((team) => team.seed != null)
    .sort((a, b) => (a.seed ?? 99) - (b.seed ?? 99));
  const bubbleNeighbors = seeded.filter((team) => (team.seed ?? 99) > 7);

  // Record-based threat: within one game of the challenger
  const recordThreat = bubbleNeighbors.find((team) => Math.abs(gamesBack(challenger, team)) <= 1);
  if (recordThreat) return recordThreat;

  // PF-based threat to the clutch seed
  const pfLeader = bubbleNeighbors.reduce<Team | null>((best, team) => {
    if (!best) return team;
    return team.pointsFor > best.pointsFor ? team : best;
  }, null);

  if (!pfLeader) return null;

  const gapToPfLeader = cutoff.pointsFor - pfLeader.pointsFor;
  const threshold = Math.max(75, avgPf); // generous: a typical weekly score keeps the door open

  return gapToPfLeader <= threshold ? pfLeader : null;
};

const buildBubbleNarrative = (teams: Team[]): NarrativeSection | null => {
  const race = computePlayoffRaceInsights(teams)?.bubbleRace;
  if (!race) return null;

  const { cutoff, challenger } = race;
  const recordGap = recordLead(cutoff, challenger);
  const tiedOnRecord = recordGap.games === 0;
  const pfGap = pfSwingNeeded(cutoff, challenger);
  const avgPf = leagueAvgPfPerGame(teams);
  const thirdTeam = findBubbleThirdTeam(teams, cutoff, challenger, avgPf);

  const summary = (
    <>
      {seedToken(cutoff)} vs {seedToken(challenger)}.{' '}
      {tiedOnRecord ? (
        <>These two teams are locked together on record. </>
      ) : (
        <>
          {seedToken(recordGap.leader ?? cutoff)} is {recordGap.games.toFixed(1)} games ahead in the
          standings.{' '}
        </>
      )}
      {seedToken(cutoff)} holds the No. 6 seed right now because of a +{pfGap.toFixed(1)} PF edge.
    </>
  );

  const pfSwingText = pfGap.toFixed(1);
  const scenarios = tiedOnRecord
    ? [
        <>
          {boldName(cutoff)} keeps No. 6 with a win and higher PF than {boldName(challenger)}.
        </>,
        <>
          {boldName(challenger)} flips to No. 6 by winning and outscoring {boldName(cutoff)} by +
          {pfSwingText}.
        </>,
        <>
          If both lose, the flip still happens if {boldName(challenger)} outscores {boldName(cutoff)}{' '}
          by +{pfSwingText}.
        </>,
      ]
    : recordGap.leader?.sleeperRosterId === cutoff.sleeperRosterId
      ? [
          <>
            {boldName(cutoff)} stays put by matching {boldName(challenger)}'s result or winning
            outright.
          </>,
          <>
            {boldName(challenger)} needs a result swing plus a {pfSwingText} PF edge to steal the
            clutch rule spot.
          </>,
          <>
            If records stay apart, {boldName(cutoff)} keeps No. 6 even if PF tightens.
          </>,
        ]
      : [
          <>
            {boldName(cutoff)} still owns the clutch rule spot until {boldName(challenger)} erases
            the +{pfSwingText} PF gap.
          </>,
          <>
            {boldName(challenger)} can take it by outscoring {boldName(cutoff)} by +{pfSwingText}{' '}
            while keeping their record edge.
          </>,
          <>
            {boldName(cutoff)} keeps No. 6 if the PF lead holds, even if the records stay split.
          </>,
        ];

  const note = thirdTeam
    ? (
      <>
        A third team ({seedToken(thirdTeam)}) can still enter the mix. If they win and post a high
        PF week while both current bubble teams stumble, Seed 6 may shift again. In that scenario,
        either {seedToken(cutoff)} or {seedToken(challenger)} could fall to Seed 7 or out of the
        playoffs entirely based on the clutch rule.
      </>
    )
    : 'No other teams are in range to take Seeds 6 or 7 this week based on current record and PF math.';

  return {
    heading: 'Bubble Watch',
    summary,
    scenarios,
    note,
  };
};

const findByeThirdTeam = (
  teams: Team[],
  holder: Team,
  challenger: Team,
  avgPf: number,
): Team | null => {
  const seeded = teams
    .filter((team) => team.seed != null)
    .sort((a, b) => (a.seed ?? 99) - (b.seed ?? 99));
  const candidates = seeded.filter(
    (team) =>
      (team.seed ?? 99) > 3 &&
      team.sleeperRosterId !== holder.sleeperRosterId &&
      team.sleeperRosterId !== challenger.sleeperRosterId,
  );

  const recordThreat = candidates.find((team) => Math.abs(gamesBack(holder, team)) <= 1);
  if (!recordThreat) return null;

  const pfGapToHolder = holder.pointsFor - recordThreat.pointsFor;
  const threshold = Math.max(75, avgPf);

  return pfGapToHolder <= threshold ? recordThreat : null;
};

const buildByeNarrative = (teams: Team[]): NarrativeSection | null => {
  const race = computePlayoffRaceInsights(teams)?.byeRace;
  if (!race) return null;

  const { holder, challenger } = race;
  const recordGap = recordLead(holder, challenger);
  const tiedOnRecord = recordGap.games === 0;
  const pfGap = pfSwingNeeded(holder, challenger);
  const avgPf = leagueAvgPfPerGame(teams);
  const thirdTeam = findByeThirdTeam(teams, holder, challenger, avgPf);

  const summary = (
    <>
      {seedToken(holder)} currently holds the Round 1 bye.{' '}
      {tiedOnRecord ? (
        <>
          {seedToken(challenger)} has the same record but trails on Points For (PF) by{' '}
          {pfGap.toFixed(1)}.
        </>
      ) : recordGap.leader?.sleeperRosterId === holder.sleeperRosterId ? (
        <>
          {seedToken(challenger)} is {recordGap.games.toFixed(1)} games back and trails on PF by{' '}
          {pfGap.toFixed(1)}.
        </>
      ) : (
        <>
          {seedToken(challenger)} is {recordGap.games.toFixed(1)} games ahead on record but still
          trails on PF by {pfGap.toFixed(1)}, which is the current separator.
        </>
      )}
    </>
  );

  const scenarios = tiedOnRecord
    ? [
        <>
          {boldName(challenger)} claims the bye with a win that erases the {pfGap.toFixed(1)} PF
          gap.
        </>,
        <>
          {boldName(challenger)} also gets the bye if they win while {boldName(holder)} loses (no PF
          math needed).
        </>,
        <>
          If both win or both lose, the bye stays with {boldName(holder)} unless the PF gap closes.
        </>,
      ]
    : recordGap.leader?.sleeperRosterId === holder.sleeperRosterId
      ? [
          <>
            {boldName(challenger)} needs a win and a {boldName(holder)} loss to close the{' '}
            {recordGap.games.toFixed(1)}-game gap.
          </>,
          <>
            If records tie, PF decides; current gap favors {boldName(holder)} by {pfGap.toFixed(1)}.
          </>,
        ]
      : [
          <>
            {boldName(challenger)} can claim the bye by holding the record edge and outscoring{' '}
            {boldName(holder)} by {pfGap.toFixed(1)}+ to flip PF.
          </>,
          <>
            {boldName(holder)} keeps the bye if they maintain the PF cushion even if{' '}
            {boldName(challenger)} stays ahead on record.
          </>,
        ];

  const note = thirdTeam ? (
    <>
      A third team ({seedToken(thirdTeam)}) remains a mathematical threat if they win and both top
      teams falter. This needs specific record/PF combos but is still on the table.
    </>
  ) : undefined;

  return {
    heading: 'Bye Chase',
    summary,
    scenarios,
    note,
  };
};

const buildDivisionNarratives = (teams: Team[]): NarrativeSection[] => {
  const insights = computePlayoffRaceInsights(teams);
  if (!insights) return [];

  return insights.divisionRaces.map((race) => {
    const pfGap = pfSwingNeeded(race.leader, race.chaser);
    const tiedOnRecord = race.gamesBack === 0;
    const divisionLabel = race.divisionName ?? 'Division';

    const summary = tiedOnRecord ? (
      <>
        {divisionLabel}: {seedToken(race.leader)} and {seedToken(race.chaser)} share the same
        record. Points For is the division tiebreaker and {boldName(race.leader)} leads by{' '}
        {pfGap.toFixed(1)}.
      </>
    ) : (
      <>
        {divisionLabel}: {seedToken(race.leader)} leads {seedToken(race.chaser)} by{' '}
        {race.gamesBack.toFixed(1)} games. Points For will decide it if the records tie (gap{' '}
        {pfGap.toFixed(1)}).
      </>
    );

    const scenarios = tiedOnRecord
      ? [
          <>
            {boldName(race.chaser)} takes the banner by outscoring {boldName(race.leader)} by{' '}
            {pfGap.toFixed(1)}+ while the records stay tied.
          </>,
          <>
            {boldName(race.chaser)} also takes it with a win and a {boldName(race.leader)} loss (no
            PF math needed).
          </>,
        ]
      : [
          <>
            {boldName(race.chaser)} must win and {boldName(race.leader)} must lose to pull even.
          </>,
          <>
            If they tie on record, PF decides; current gap favors {boldName(race.leader)} by{' '}
            {pfGap.toFixed(1)}.
          </>,
        ];

    return {
      heading: 'Division Race',
      id: divisionLabel,
      summary,
      scenarios,
    };
  });
};

export function buildPlayoffNarratives(teams: Team[]): PlayoffNarratives | null {
  if (!teams.length) return null;

  const bubble = buildBubbleNarrative(teams);
  const bye = buildByeNarrative(teams);
  const divisions = buildDivisionNarratives(teams);

  if (!bubble && !bye && divisions.length === 0) {
    return null;
  }

  return { bubble, bye, divisions };
}
