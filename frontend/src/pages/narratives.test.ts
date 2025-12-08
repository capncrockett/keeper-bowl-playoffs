import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildPlayoffNarratives, STANDINGS_GLOSSARY } from './narratives.tsx';
import { computeSeeds, mergeRostersAndUsersToTeams } from '../utils/sleeperTransforms';
import { mockSleeperLeague, mockSleeperRosters, mockSleeperUsers } from '../test/fixtures/sleeper';

const buildTeams = () =>
  computeSeeds(mergeRostersAndUsersToTeams(mockSleeperRosters, mockSleeperUsers, mockSleeperLeague));

const toText = (node: React.ReactNode | undefined) =>
  node == null ? '' : renderToStaticMarkup(createElement(Fragment, null, node));

describe('buildPlayoffNarratives', () => {
  it('returns null with no teams', () => {
    expect(buildPlayoffNarratives([])).toBeNull();
  });

  it('builds bubble, bye, and division narratives with clarity text', () => {
    const narratives = buildPlayoffNarratives(buildTeams());

    expect(narratives).not.toBeNull();
    if (!narratives) return;

    expect(toText(narratives.bubble?.summary)).toContain('+74.5');
    expect(toText(narratives.bubble?.note)).toMatch(/third team/i);

    expect(toText(narratives.bye?.summary)).toMatch(/Round 1 bye/i);
    expect(toText(narratives.bye?.scenarios[0])).toMatch(/claims the bye|can claim the bye/i);

    expect(narratives.divisions.length).toBeGreaterThan(0);
    expect(toText(narratives.divisions[0].summary)).toMatch(/Points For/i);
  });

  it('exposes glossary entries for standings UI', () => {
    const clutch = STANDINGS_GLOSSARY.find((entry) => entry.code === 'c6');
    expect(clutch?.description).toMatch(/clutch rule/i);
    expect(STANDINGS_GLOSSARY.find((entry) => entry.code === 'bw')?.description).toMatch(/Best\/Worst/i);
  });
});
