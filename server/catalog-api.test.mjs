import { describe, expect, it } from 'vitest';
import {
  buildBangumiSearchPayload,
  buildMusicBrainzQuery,
  mapBangumiSubject,
  mapMusicBrainzReleaseGroup,
  matchesBangumiCategory,
} from './catalog-api.mjs';

const makeSubject = (overrides = {}) => ({
  id: 1,
  name: 'Example',
  name_cn: '示例',
  date: '2025-01-01',
  platform: '华语剧',
  meta_tags: ['电视剧', '剧情'],
  images: { large: 'https://lain.bgm.tv/pic/cover/l/example.jpg' },
  collection: { total: 100 },
  rating: { total: 20 },
  ...overrides,
});

describe('catalog API mappings', () => {
  it('keeps similarly named audio dramas out of TV results', () => {
    const audioDrama = makeSubject({ platform: '其他', meta_tags: ['中国', '广播剧'] });
    const tvDrama = makeSubject();

    expect(matchesBangumiCategory(audioDrama, 'drama')).toBe(false);
    expect(matchesBangumiCategory(tvDrama, 'drama')).toBe(true);
  });

  it('separates FC, PC, console, movie and boardgame results by source tags', () => {
    expect(matchesBangumiCategory(makeSubject({ platform: '游戏', meta_tags: ['FC', 'RPG'] }), 'fc')).toBe(true);
    expect(matchesBangumiCategory(makeSubject({ platform: '游戏', meta_tags: ['Windows', 'PC'] }), 'pc')).toBe(true);
    expect(matchesBangumiCategory(makeSubject({ platform: '游戏', meta_tags: ['PS5'] }), 'console')).toBe(true);
    expect(matchesBangumiCategory(makeSubject({ platform: '电影', meta_tags: ['电影'] }), 'movie')).toBe(true);
    expect(matchesBangumiCategory(makeSubject({ platform: '桌游', meta_tags: ['桌游'] }), 'boardgame')).toBe(true);
  });

  it('returns same-origin proxy URLs for share-poster compatibility', () => {
    const item = mapBangumiSubject(makeSubject(), 'drama', 'https://example.test');
    expect(item?.imageUrl).toContain('https://example.test/api/catalog/image?url=');

    const album = mapMusicBrainzReleaseGroup({
      id: 'album-id',
      title: 'Abbey Road',
      'first-release-date': '1969-09-26',
      'artist-credit': [{ name: 'The Beatles' }],
      'primary-type': 'Album',
      score: 100,
    }, 'https://coverartarchive.org/release-group/album-id/front-500', 'https://example.test');
    expect(album?.publisher).toBe('The Beatles');
    expect(album?.imageUrl).toContain('https://example.test/api/catalog/image?url=');
  });

  it('builds album discovery queries from the selected music genre', () => {
    expect(buildMusicBrainzQuery('', '电子', 'all')).toBe('primarytype:album AND tag:"electronic"');
    expect(buildMusicBrainzQuery('Discovery', '电子', '2000s')).toBe(
      'releasegroup:"Discovery" AND primarytype:album AND tag:"electronic" AND firstreleasedate:[2000-01-01 TO 2009-12-31]',
    );
  });

  it('builds database filters for category, genre and decade browsing', () => {
    expect(buildBangumiSearchPayload('movie', '', '剧情', '2020s')).toEqual({
      keyword: '',
      sort: 'heat',
      filter: {
        type: [6],
        nsfw: false,
        meta_tags: ['电影'],
        tag: ['剧情'],
        air_date: ['>=2020-01-01', '<2030-01-01'],
      },
    });
    expect(buildBangumiSearchPayload('drama', '难哄', '都市爱情', 'all')).toEqual({
      keyword: '难哄',
      sort: 'match',
      filter: {
        type: [6],
        nsfw: false,
        meta_tags: ['电视剧'],
        tag: ['爱情'],
      },
    });
  });

  it('keeps the selected product genre on provider results', () => {
    expect(mapBangumiSubject(makeSubject(), 'drama', 'https://example.test', '都市爱情')?.genre)
      .toBe('都市爱情');
  });
});
