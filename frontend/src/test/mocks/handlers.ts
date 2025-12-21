// frontend/src/test/mocks/handlers.ts

import { http, HttpResponse } from 'msw';
import {
  mockSleeperUsers,
  mockSleeperRosters,
  mockSleeperMatchupsWeek13,
  mockSleeperMatchupsWeek15,
  mockSleeperMatchupsWeek16,
  mockSleeperMatchupsWeek17,
  mockNFLState,
  mockPlayoffWinnersBracket,
  mockPlayoffLosersBracket,
  mockSleeperPlayers,
  mockSleeperLeague,
} from '../fixtures/sleeper';
import { mockESPNScoreboard } from '../fixtures/espn';

const SLEEPER_BASE = 'https://api.sleeper.app/v1';
const ESPN_BASE = 'https://site.api.espn.com';

export const handlers = [
  // Sleeper League
  http.get(`${SLEEPER_BASE}/league/:leagueId`, () => {
    return HttpResponse.json(mockSleeperLeague);
  }),

  // Sleeper League Users
  http.get(`${SLEEPER_BASE}/league/:leagueId/users`, () => {
    return HttpResponse.json(mockSleeperUsers);
  }),

  // Sleeper League Rosters
  http.get(`${SLEEPER_BASE}/league/:leagueId/rosters`, () => {
    return HttpResponse.json(mockSleeperRosters);
  }),

  // Sleeper Matchups (week 13)
  http.get(`${SLEEPER_BASE}/league/:leagueId/matchups/:week`, ({ params }) => {
    const week = params.week as string;
    if (week === '13') {
      return HttpResponse.json(mockSleeperMatchupsWeek13);
    }
    if (week === '15') {
      return HttpResponse.json(mockSleeperMatchupsWeek15);
    }
    if (week === '16') {
      return HttpResponse.json(mockSleeperMatchupsWeek16);
    }
    if (week === '17') {
      return HttpResponse.json(mockSleeperMatchupsWeek17);
    }
    return HttpResponse.json([]);
  }),

  // NFL State
  http.get(`${SLEEPER_BASE}/state/nfl`, () => {
    return HttpResponse.json(mockNFLState);
  }),

  // Winners Bracket
  http.get(`${SLEEPER_BASE}/league/:leagueId/winners_bracket`, () => {
    return HttpResponse.json(mockPlayoffWinnersBracket);
  }),

  // Losers Bracket
  http.get(`${SLEEPER_BASE}/league/:leagueId/losers_bracket`, () => {
    return HttpResponse.json(mockPlayoffLosersBracket);
  }),

  // All Players
  http.get(`${SLEEPER_BASE}/players/nfl`, () => {
    return HttpResponse.json(mockSleeperPlayers);
  }),

  // ESPN Scoreboard
  http.get(`${ESPN_BASE}/apis/site/v2/sports/football/nfl/scoreboard`, () => {
    return HttpResponse.json(mockESPNScoreboard);
  }),
];

// Error handlers for testing error states
export const errorHandlers = [
  http.get(`${SLEEPER_BASE}/league/:leagueId`, () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }),

  http.get(`${SLEEPER_BASE}/league/:leagueId/users`, () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }),

  http.get(`${SLEEPER_BASE}/league/:leagueId/rosters`, () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }),

  http.get(`${SLEEPER_BASE}/league/:leagueId/matchups/:week`, () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }),

  http.get(`${ESPN_BASE}/apis/site/v2/sports/football/nfl/scoreboard`, () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }),
];
