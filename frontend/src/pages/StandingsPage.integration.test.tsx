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

  it('renders insights cards with fixture data', async () => {
    render(<StandingsPage />);

    const toughestCardHeading = await screen.findByText(/Toughest Schedule/i);
    const toughestCard = toughestCardHeading.closest('.card');
    expect(toughestCard).toBeInTheDocument();
    if (toughestCard instanceof HTMLElement) {
      expect(
        within(toughestCard).getByText(/Team Twelve is eating 130\.8 PA per week/i),
      ).toBeInTheDocument();
      expect(within(toughestCard).getByText(/118\.4/)).toBeInTheDocument();
    }

    const easiestCardHeading = await screen.findByText(/Easiest Schedule/i);
    const easiestCard = easiestCardHeading.closest('.card');
    expect(easiestCard).toBeInTheDocument();
    if (easiestCard instanceof HTMLElement) {
      expect(
        within(easiestCard).getByText(/Big Ol' TDs sees only 107\.7 PA per week/i),
      ).toBeInTheDocument();
    }
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

  it('hides insights before any games are played', async () => {
    const zeroed = mockSleeperRosters.map((roster) => ({
      ...roster,
      settings: {
        ...roster.settings,
        wins: 0,
        losses: 0,
        ties: 0,
        fpts: 0,
        fpts_decimal: 0,
        fpts_against: 0,
        fpts_against_decimal: 0,
      },
    }));
    rostersSpy.mockResolvedValueOnce(zeroed);

    render(<StandingsPage />);

    expect(
      await screen.findByRole('heading', { name: /standings/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Toughest Schedule/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Easiest Schedule/i)).not.toBeInTheDocument();
  });
});
