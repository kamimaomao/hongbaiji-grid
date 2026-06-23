import { describe, expect, it } from 'vitest';
import { fcGames } from './fcGames';

describe('fcGames catalog', () => {
  it('contains enough games for the first playable picker', () => {
    expect(fcGames.length).toBeGreaterThanOrEqual(100);
  });

  it('has stable unique ids', () => {
    const ids = fcGames.map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has the fields needed by search and poster generation', () => {
    for (const game of fcGames) {
      expect(game.id).toMatch(/^[a-z0-9-]+$/);
      expect(game.titleZh.length).toBeGreaterThan(0);
      expect(game.titleOriginal.length).toBeGreaterThan(0);
      expect(game.year).toBeGreaterThanOrEqual(1983);
      expect(game.year).toBeLessThanOrEqual(1994);
      expect(game.publisher.length).toBeGreaterThan(0);
      expect(game.genre.length).toBeGreaterThan(0);
      expect(game.imageUrl.length).toBeGreaterThan(0);
    }
  });
});
