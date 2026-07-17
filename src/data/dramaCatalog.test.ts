import { describe, expect, it } from 'vitest';
import sources from './generated/drama-poster-sources.json';
import { dramaShows } from './experiences';

describe('drama poster catalog', () => {
  it('keeps every visible drama matched to a verified poster source', () => {
    expect(dramaShows).toHaveLength(12);
    expect(sources).toHaveLength(dramaShows.length);

    for (const show of dramaShows) {
      const source = sources.find((item) => item.title === show.titleZh);
      expect(source).toBeDefined();
      expect(source?.year).toBe(show.year);
      expect(source?.source).toMatch(/^https:\/\/www\.themoviedb\.org\/tv\/\d+/);
      expect(show.imageUrl).toContain(`${source?.file}?v=20260717`);
    }
  });
});
