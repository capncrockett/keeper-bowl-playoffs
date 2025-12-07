import { screen, waitFor } from '@testing-library/react';
import App from './App';
import { renderWithRouter } from './test/testUtils';

// Mock pages to avoid real data fetching
jest.mock('./pages/MatchupsPage', () => ({
  MatchupsPage: () => <div>Matchups Page</div>,
}));

jest.mock('./pages/PlayoffsIfTodayPage', () => ({
  __esModule: true,
  default: () => <div>If Today Page</div>,
}));

jest.mock('./pages/PlayoffsLivePage', () => ({
  __esModule: true,
  default: () => <div>Live Playoffs Page</div>,
}));

jest.mock('./pages/StandingsPage', () => ({
  StandingsPage: () => <div>Standings Page</div>,
}));

// Theme selector manipulates DOM/localStorage; keep it simple for tests
jest.mock('./components/ThemeSelector', () => ({
  ThemeSelector: () => <div>Theme Picker</div>,
}));

describe('App routing + nav', () => {
  it('redirects "/" to "/matchups" and highlights nav', async () => {
    renderWithRouter(<App />, { route: '/' });

    expect(await screen.findByText('Matchups Page')).toBeInTheDocument();

    const matchupsLink = screen.getByRole('link', { name: /matchups/i });
    await waitFor(() => {
      expect(matchupsLink).toHaveClass('btn-active');
    });
  });

  it('renders requested route and nav state', () => {
    renderWithRouter(<App />, { route: '/playoffs/if-today' });

    expect(screen.getByText('If Today Page')).toBeInTheDocument();

    const ifTodayLink = screen.getByRole('link', { name: /if today/i });
    const matchupsLink = screen.getByRole('link', { name: /matchups/i });

    expect(ifTodayLink).toHaveClass('btn-active');
    expect(matchupsLink).not.toHaveClass('btn-active');
  });
});
