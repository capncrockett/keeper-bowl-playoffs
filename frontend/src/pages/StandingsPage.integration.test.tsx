import { render, screen, within } from '@testing-library/react';
import { StandingsPage } from './StandingsPage';
import {
  mockSleeperLeague,
  mockSleeperRosters,
  mockSleeperUsers,
} from '../test/fixtures/sleeper';
import * as sleeperApi from '../api/sleeper';

describe('StandingsPage', () => {
  let leagueSpy: jest.SpyInstance;
  let usersSpy: jest.SpyInstance;
  let rostersSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    leagueSpy = jest.spyOn(sleeperApi, 'getLeague').mockResolvedValue(mockSleeperLeague);
    usersSpy = jest.spyOn(sleeperApi, 'getLeagueUsers').mockResolvedValue(mockSleeperUsers);
    rostersSpy = jest.spyOn(sleeperApi, 'getLeagueRosters').mockResolvedValue(mockSleeperRosters);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders standings table with seeds', async () => {
    render(<StandingsPage />);

    expect(
      await screen.findByRole('heading', { name: /standings/i }),
    ).toBeInTheDocument();
    const rows = await screen.findAllByRole('row');
    const row = rows.find((candidate) =>
      within(candidate).queryByText(/Big Ol' TDs/i),
    );
    expect(row).toBeInTheDocument();
    expect(row).toHaveTextContent(/\b1\b/);
  });

  it('shows empty state when no teams', async () => {
    rostersSpy.mockResolvedValueOnce([]);
    usersSpy.mockResolvedValueOnce([]);

    render(<StandingsPage />);

    expect(
      await screen.findByText(/No teams found/i),
    ).toBeInTheDocument();
  });

  it('surfaces API errors', async () => {
    leagueSpy.mockRejectedValueOnce(new Error('boom'));

    render(<StandingsPage />);

    expect(
      await screen.findByText(/Failed to load standings/i),
    ).toBeInTheDocument();
  });
});
