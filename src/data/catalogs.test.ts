import { describe, expect, it } from 'vitest';
import { getDecadeOptions } from './catalogs';

describe('catalog filter options', () => {
  it('fills continuous music decades through the requested year', () => {
    const options = getDecadeOptions([
      {
        id: 'album',
        titleZh: 'Album',
        titleOriginal: 'Album',
        aliases: [],
        year: 1959,
        publisher: 'Artist',
        genre: '爵士',
        popularity: 1,
        imageUrl: '/album.jpg',
      },
    ], 2026);

    expect(options.map((option) => option.value)).toEqual([
      '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s',
    ]);
  });
});
