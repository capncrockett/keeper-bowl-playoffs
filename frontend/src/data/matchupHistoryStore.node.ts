import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { MatchupHistory, StoredMatchup } from './matchupHistoryTypes';
import { normalizeTeamName } from './matchupHistory';

const STORE_FILE_URL = new URL('./matchupHistoryStore.json', import.meta.url);
export const MATCHUP_HISTORY_STORE_PATH = fileURLToPath(STORE_FILE_URL);

const sortMatchups = (matchups: MatchupHistory): MatchupHistory =>
  [...matchups].sort((a, b) => {
    if (a.week !== b.week) return a.week - b.week;
    return a.team.localeCompare(b.team);
  });

export async function readMatchupHistoryFromDisk(): Promise<MatchupHistory> {
  try {
    const raw = await readFile(MATCHUP_HISTORY_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as MatchupHistory;
    return sortMatchups(parsed);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeMatchupHistoryToDisk(
  matchups: MatchupHistory,
): Promise<MatchupHistory> {
  const sorted = sortMatchups(matchups);
  const payload = `${JSON.stringify(sorted, null, 2)}\n`;
  await writeFile(MATCHUP_HISTORY_STORE_PATH, payload, 'utf8');
  return sorted;
}

export async function appendWeekMatchups(
  week: number,
  entries: StoredMatchup[],
): Promise<MatchupHistory> {
  const existing = await readMatchupHistoryFromDisk();
  const withoutWeek = existing.filter((m) => m.week !== week);
  const normalized: MatchupHistory = entries.map((entry) => ({
    ...entry,
    week,
    margin: Number(entry.margin.toFixed(2)),
    pointsFor: Number(entry.pointsFor.toFixed(2)),
    pointsAgainst: Number(entry.pointsAgainst.toFixed(2)),
  }));
  return writeMatchupHistoryToDisk([...withoutWeek, ...normalized]);
}

export function getMarginsForWeekFromEntries(
  week: number,
  entries: MatchupHistory,
): Map<string, number> {
  const margins = new Map<string, number>();
  entries
    .filter((m) => m.week === week)
    .forEach((m) => {
      margins.set(m.team, m.margin);
      margins.set(normalizeTeamName(m.team), m.margin);
    });
  return margins;
}
