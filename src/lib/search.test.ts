import { describe, expect, it } from 'vitest';
import { fcGames } from '../data/fcGames';
import { filterGames, sortGames } from './search';

describe('search utilities', () => {
  it('searches Chinese titles and aliases', () => {
    expect(filterGames(fcGames, { query: '魂斗罗' }).map((game) => game.id)).toContain('contra');
    expect(filterGames(fcGames, { query: '超级玛丽' }).map((game) => game.id)).toContain('super-mario-bros');
    expect(filterGames(fcGames, { query: '爱的小屋' }).map((game) => game.id)).toContain('nuts-and-milk');
    expect(filterGames(fcGames, { query: '打理师' }).map((game) => game.id)).toContain('popeye');
  });

  it('searches English titles case-insensitively', () => {
    expect(filterGames(fcGames, { query: 'mega man' }).map((game) => game.id)).toContain('rockman-2');
  });

  it('filters by publisher, genre, and decade', () => {
    const result = filterGames(fcGames, {
      publisher: 'Konami',
      genre: '射击',
      decade: '1980s',
    });

    expect(result.map((game) => game.id)).toEqual(expect.arrayContaining(['contra', 'gradius']));
  });

  it('sorts by popularity and year', () => {
    expect(sortGames(fcGames, 'popularity')[0].id).toBe('super-mario-bros');
    expect(sortGames(fcGames, 'year-asc')[0].year).toBe(Math.min(...fcGames.map((game) => game.year)));
  });
});
