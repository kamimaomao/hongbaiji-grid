import { describe, expect, it } from 'vitest';
import { filterGames } from '../lib/search';
import { animeCatalog } from './animeCatalog';

describe('animeCatalog', () => {
  it('contains at least 1000 anime entries', () => {
    expect(animeCatalog.length).toBeGreaterThanOrEqual(1000);
  });

  it('has stable unique ids and usable poster urls', () => {
    const ids = animeCatalog.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of animeCatalog) {
      expect(item.titleZh.length).toBeGreaterThan(0);
      expect(item.titleOriginal.length).toBeGreaterThan(0);
      expect(item.year).toBeGreaterThanOrEqual(1900);
      expect(item.publisher.length).toBeGreaterThan(0);
      expect(item.genre.length).toBeGreaterThan(0);
      expect(item.imageUrl).toMatch(/^https:\/\/s4\.anilist\.co\//);
    }
  });

  it('supports Chinese searches for major titles', () => {
    expect(filterGames(animeCatalog, { query: '咒术回战' }).map((item) => item.id)).toContain('anime-113415');
    expect(filterGames(animeCatalog, { query: '海贼王' }).map((item) => item.id)).toContain('anime-21');
    expect(filterGames(animeCatalog, { query: '鬼灭之刃' }).map((item) => item.id)).toContain('anime-101922');
  });
});
