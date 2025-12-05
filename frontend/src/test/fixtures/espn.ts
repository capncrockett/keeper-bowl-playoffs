// frontend/src/test/fixtures/espn.ts

import type { ESPNScoreboard } from '../../api/espn';

const finalStatus = { type: { name: 'STATUS_FINAL', state: 'post', completed: true } };
const inProgressStatus = { type: { name: 'STATUS_IN_PROGRESS', state: 'in', completed: false } };

export const mockESPNScoreboard: ESPNScoreboard = {
  events: [
    {
      id: 'game1',
      status: finalStatus,
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'KC', displayName: 'KC' } },
            { team: { abbreviation: 'LV', displayName: 'LV' } },
          ],
          status: finalStatus,
        },
      ],
    },
    {
      id: 'game2',
      status: inProgressStatus,
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'BUF', displayName: 'BUF' } },
            { team: { abbreviation: 'NYJ', displayName: 'NYJ' } },
          ],
          status: inProgressStatus,
        },
      ],
    },
    {
      id: 'game3',
      status: finalStatus,
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'MIA', displayName: 'MIA' } },
            { team: { abbreviation: 'NE', displayName: 'NE' } },
          ],
          status: finalStatus,
        },
      ],
    },
    {
      id: 'game4',
      status: finalStatus,
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'SF', displayName: 'SF' } },
            { team: { abbreviation: 'ARI', displayName: 'ARI' } },
          ],
          status: finalStatus,
        },
      ],
    },
    {
      id: 'game5',
      status: finalStatus,
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'DAL', displayName: 'DAL' } },
            { team: { abbreviation: 'NYG', displayName: 'NYG' } },
          ],
          status: finalStatus,
        },
      ],
    },
    {
      id: 'game6',
      status: finalStatus,
      competitions: [
        {
          competitors: [
            { team: { abbreviation: 'PHI', displayName: 'PHI' } },
            { team: { abbreviation: 'WAS', displayName: 'WAS' } },
          ],
          status: finalStatus,
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
