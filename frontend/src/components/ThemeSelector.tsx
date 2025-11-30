import { useEffect, useState } from 'react';

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'cupcake', label: 'Mellow Light' },
  { value: 'synthwave', label: 'Brighter Dark' },
  { value: 'dark', label: 'Dark' },
] as const;

type ThemeValue = (typeof THEMES)[number]['value'];

const STORAGE_KEY = 'keeper-bowl-theme';

export function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeValue>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as ThemeValue) || 'dark';
  });

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initialTheme = (stored as ThemeValue) || 'dark';
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Update theme when changed
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-5 h-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          ></path>
        </svg>
        <span className="hidden md:inline ml-1">Theme</span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-3 border border-base-300"
      >
        {THEMES.map((t) => (
          <li key={t.value}>
            <button
              onClick={() => setTheme(t.value)}
              className={theme === t.value ? 'active' : ''}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
