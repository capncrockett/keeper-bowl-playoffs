// frontend/src/test/fixtures/espn.ts

import type { ESPNScoreboard, ESPNEvent } from '../../api/espn';

export const mockESPNScoreboard: ESPNScoreboard = {
  events: [
    {
      id: 'game1',
      status: { type: { completed: true } },
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'KC' } },
            { team: { abbreviation: 'LV' } },
          ],
        },
      ],
    },
    {
      id: 'game2',
      status: { type: { completed: false } },
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'BUF' } },
            { team: { abbreviation: 'NYJ' } },
          ],
        },
      ],
    },
    {
      id: 'game3',
      status: { type: { completed: true } },
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'MIA' } },
            { team: { abbreviation: 'NE' } },
          ],
        },
      ],
    },
    {
      id: 'game4',
      status: { type: { completed: true } },
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'SF' } },
            { team: { abbreviation: 'ARI' } },
          ],
        },
      ],
    },
    {
      id: 'game5',
      status: { type: { completed: true } },
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'DAL' } },
            { team: { abbreviation: 'NYG' } },
          ],
        },
      ],
    },
    {
      id: 'game6',
      status: { type: { completed: true } },
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'PHI' } },
            { team: { abbreviation: 'WAS' } },
          ],
        },
      ],
    },
  ],
};

// Helper to create game status map (simulates what getESPNGameStatus returns)
export const mockGameStatusMap = new Map<string, boolean>([
  ['KC', true],
  ['LV', true],
  ['BUF', false], // Still playing
  ['NYJ', false],
  ['MIA', true],
  ['NE', true],
  ['SF', true],
  ['ARI', true],
  ['DAL', true],
  ['NYG', true],
  ['PHI', true],
  ['WAS', true],
]);
