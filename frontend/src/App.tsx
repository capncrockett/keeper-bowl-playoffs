import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeSelector } from './components/ThemeSelector';
import { MatchupsPage } from './pages/MatchupsPage';
import PlayoffsIfTodayPage from './pages/PlayoffsIfTodayPage';
import PlayoffsLivePage from './pages/PlayoffsLivePage';
import { StandingsPage } from './pages/StandingsPage';

type NavLinkProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

function NavLink({ to, label, icon }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`btn btn-ghost btn-sm ${isActive ? 'btn-active font-semibold' : 'opacity-80'}`}
    >
      <span className="flex items-center gap-1">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </span>
    </Link>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200 text-base-content">
      <header className="navbar bg-base-100 shadow-md">
        <div className="navbar-start">
          <span className="btn btn-ghost normal-case text-sm sm:text-xl font-bold">
            <span className="hidden sm:inline">Keeper Bowl Playoffs</span>
            <span className="sm:hidden">KB Playoffs</span>
          </span>
        </div>
        <div className="navbar-center">
          <nav className="flex gap-1 sm:gap-2">
            <NavLink
              to="/playoffs/live"
              label="Playoffs"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              }
            />
            <NavLink
              to="/playoffs/if-today"
              label="If Today"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
            />
            <NavLink
              to="/matchups"
              label="Matchups"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
            <NavLink
              to="/standings"
              label="Standings"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          </nav>
        </div>
        <div className="navbar-end">
          <ThemeSelector />
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/playoffs/live" replace />} />
          <Route path="/playoffs" element={<Navigate to="/playoffs/live" replace />} />
          <Route path="/matchups" element={<MatchupsPage />} />
          <Route path="/playoffs/if-today" element={<PlayoffsIfTodayPage />} />
          <Route path="/playoffs/live" element={<PlayoffsLivePage />} />
          <Route path="/standings" element={<StandingsPage />} />
        </Routes>
      </main>

      <footer className="footer footer-center p-4 mt-24 bg-base-100 text-xs opacity-70">
        <div>Keeper Bowl Playoffs - frontend POC</div>
      </footer>
      <SpeedInsights />
    </div>
  );
}
