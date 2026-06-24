import type { FcGame, GameGenre } from '../types';

export type DecadeFilter = 'all' | `${number}s`;
export type SortMode = 'popularity' | 'year-asc' | 'year-desc' | 'title';

export interface GameFilters {
  query?: string;
  publisher?: string;
  genre?: GameGenre | 'all';
  decade?: DecadeFilter;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase('zh-CN');

const matchesQuery = (game: FcGame, query: string) => {
  const normalized = normalize(query);
  if (!normalized) return true;

  return [game.titleZh, game.titleOriginal, ...game.aliases]
    .map(normalize)
    .some((value) => value.includes(normalized));
};

const matchesDecade = (game: FcGame, decade: DecadeFilter = 'all') => {
  if (decade === 'all') return true;
  const startYear = Number.parseInt(decade, 10);
  return game.year >= startYear && game.year <= startYear + 9;
};

export const filterGames = (games: FcGame[], filters: GameFilters = {}) =>
  games.filter((game) => {
    if (!matchesQuery(game, filters.query ?? '')) return false;
    if (filters.publisher && game.publisher !== filters.publisher) return false;
    if (filters.genre && filters.genre !== 'all' && game.genre !== filters.genre) return false;
    if (!matchesDecade(game, filters.decade ?? 'all')) return false;
    return true;
  });

export const sortGames = (games: FcGame[], mode: SortMode) => {
  const sorted = [...games];
  if (mode === 'popularity') {
    return sorted.sort((a, b) => b.popularity - a.popularity);
  }
  if (mode === 'year-asc') {
    return sorted.sort((a, b) => a.year - b.year || b.popularity - a.popularity);
  }
  if (mode === 'year-desc') {
    return sorted.sort((a, b) => b.year - a.year || b.popularity - a.popularity);
  }
  return sorted.sort((a, b) => a.titleZh.localeCompare(b.titleZh, 'zh-CN'));
};
