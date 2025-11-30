import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeSelector } from './components/ThemeSelector';
import { MatchupsPage } from './pages/MatchupsPage';
import PlayoffsIfTodayPage from './pages/PlayoffsIfTodayPage';
import PlayoffsLivePage from './pages/PlayoffsLivePage';
import { StandingsPage } from './pages/StandingsPage';

type NavLinkProps = {
  to: string;
  label: string;
};

function NavLink({ to, label }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`btn btn-ghost btn-sm ${isActive ? 'btn-active font-semibold' : 'opacity-80'}`}
    >
      {label}
    </Link>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-200 text-base-content">
      <header className="navbar bg-base-100 shadow-md">
        <div className="navbar-start">
          <span className="btn btn-ghost normal-case text-xl font-bold">Keeper Bowl Playoffs</span>
        </div>
        <div className="navbar-center">
          <nav className="flex gap-2">
            <NavLink to="/matchups" label="Matchups" />
            <NavLink to="/playoffs/if-today" label="If Today" />
            <NavLink to="/playoffs/live" label="Playoffs" />
            <NavLink to="/standings" label="Standings" />
          </nav>
        </div>
        <div className="navbar-end">
          <ThemeSelector />
        </div>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/matchups" replace />} />
          <Route path="/matchups" element={<MatchupsPage />} />
          <Route path="/playoffs/if-today" element={<PlayoffsIfTodayPage />} />
          <Route path="/playoffs/live" element={<PlayoffsLivePage />} />
          <Route path="/standings" element={<StandingsPage />} />
        </Routes>
      </main>

      <footer className="footer footer-center p-4 bg-base-100 text-xs opacity-70">
        <div>Keeper Bowl Playoffs - frontend POC</div>
      </footer>
    </div>
  );
}
