import { EnvHttpProxyAgent, setGlobalDispatcher } from 'undici';

setGlobalDispatcher(new EnvHttpProxyAgent());

const APP_USER_AGENT = 'kamimaomao/hongbaiji-grid/0.1.0 (https://github.com/kamimaomao/hongbaiji-grid)';
const BANGUMI_SEARCH_URL = 'https://api.bgm.tv/v0/search/subjects?limit=50';
const MUSICBRAINZ_SEARCH_URL = 'https://musicbrainz.org/ws/2/release-group/';
const CACHE_TTL_MS = 15 * 60 * 1000;
const RESULT_LIMIT = 24;

const musicGenreTags = {
  '华语': 'mandopop',
  '嘻哈': 'hip hop',
  '摇滚': 'rock',
  '流行': 'pop',
  '灵魂乐': 'soul',
  '爵士': 'jazz',
  '电子': 'electronic',
  '独立': 'indie',
};

const searchCache = new Map();

const bangumiTypeByCategory = {
  anime: 2,
  movie: 6,
  drama: 6,
  'classic-drama': 6,
  fc: 4,
  pc: 4,
  console: 4,
  boardgame: 4,
};

const bangumiMetaTagsByCategory = {
  movie: ['电影'],
  drama: ['电视剧'],
  'classic-drama': ['电视剧'],
  fc: ['FC'],
  pc: ['PC'],
  boardgame: ['桌游'],
};

const bangumiGenreTags = {
  '都市爱情': '爱情',
  '偶像爱情': '爱情',
  '青春爱情': '爱情',
  '偶像喜剧': '喜剧',
  '动作冒险': '冒险',
  '合作冒险': '冒险',
  '动作角色扮演': '角色扮演',
  '策略角色扮演': '角色扮演',
  '平台动作': '动作',
  '潜入动作': '动作',
  '即时战略': '策略',
};

const consoleTags = new Set([
  '3DS', 'DC', 'FC', 'GB', 'GBA', 'GBC', 'GC', 'MD', 'N64', 'NDS', 'NGC', 'NS',
  'PS', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PSV', 'SATURN', 'SFC', 'WII', 'WII U',
  'XBOX', 'XBOX 360', 'XBOX ONE', 'XSX',
]);

const pcTags = new Set(['DOS', 'LINUX', 'MAC', 'PC', 'WEB', 'WINDOWS']);
const ignoredGenreTags = new Set([
  '中国', '日本', '美国', '欧美', '华语', '游戏', '动画', '电影', '电视剧', '桌游',
  ...consoleTags,
  ...pcTags,
]);

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('zh-CN');

const json = (response, status, body) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
};

const requestOrigin = (request) => {
  const protocol = request.headers['x-forwarded-proto'] ?? 'http';
  return `${protocol}://${request.headers.host}`;
};

const imageProxyUrl = (origin, sourceUrl) =>
  `${origin}/api/catalog/image?url=${encodeURIComponent(sourceUrl)}`;

const getYear = (date) => {
  const year = Number.parseInt(String(date ?? '').slice(0, 4), 10);
  return Number.isFinite(year) ? year : 0;
};

const getBangumiTags = (subject) => [
  subject.platform,
  ...(Array.isArray(subject.meta_tags) ? subject.meta_tags : []),
].filter(Boolean).map((tag) => String(tag).toUpperCase());

export const matchesBangumiCategory = (subject, category) => {
  if (category === 'anime') return true;

  const tags = new Set(getBangumiTags(subject));
  const platform = String(subject.platform ?? '');

  if (category === 'movie') return platform === '电影' || tags.has('电影');
  if (category === 'drama' || category === 'classic-drama') {
    return tags.has('电视剧') || /剧$/.test(platform);
  }
  if (category === 'boardgame') return platform === '桌游' || tags.has('桌游');
  if (category === 'fc') return tags.has('FC') || tags.has('NES');
  if (category === 'pc') return [...tags].some((tag) => pcTags.has(tag));
  if (category === 'console') return [...tags].some((tag) => consoleTags.has(tag));
  return false;
};

export const mapBangumiSubject = (subject, category, origin, selectedGenre = '') => {
  const image = subject.images?.large ?? subject.image ?? '';
  if (!image) return null;

  const titleZh = String(subject.name_cn || subject.name || '').trim();
  const titleOriginal = String(subject.name || titleZh).trim();
  if (!titleZh) return null;

  const genre = selectedGenre || (
    (Array.isArray(subject.meta_tags) ? subject.meta_tags : [])
      .find((tag) => !ignoredGenreTags.has(String(tag).toUpperCase())) ?? '未分类'
  );
  const collectionTotal = Object.values(subject.collection ?? {})
    .reduce((total, value) => total + Number(value ?? 0), 0);
  const popularity = collectionTotal + Number(subject.rating?.total ?? 0);

  return {
    id: `${category}-bgm-${subject.id}`,
    titleZh,
    titleOriginal,
    aliases: [...new Set([subject.name, subject.name_cn].filter(Boolean).map(String))],
    year: getYear(subject.date),
    publisher: String(subject.platform || 'Bangumi'),
    genre: String(genre),
    popularity,
    imageUrl: imageProxyUrl(origin, image),
  };
};

export const buildBangumiSearchPayload = (category, query, genre, decade) => {
  const filter = {
    type: [bangumiTypeByCategory[category]],
    nsfw: false,
  };
  const metaTags = bangumiMetaTagsByCategory[category];
  if (metaTags) filter.meta_tags = metaTags;

  if (genre) filter.tag = [bangumiGenreTags[genre] ?? genre];
  if (/^\d{4}s$/.test(decade)) {
    const startYear = Number.parseInt(decade, 10);
    filter.air_date = [`>=${startYear}-01-01`, `<${startYear + 10}-01-01`];
  }

  return {
    keyword: query,
    sort: query ? 'match' : 'heat',
    filter,
  };
};

const searchBangumi = async (category, query, genre, decade, origin) => {
  const response = await fetch(BANGUMI_SEARCH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': APP_USER_AGENT,
    },
    body: JSON.stringify(buildBangumiSearchPayload(category, query, genre, decade)),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error(`Bangumi search failed: ${response.status}`);
  const payload = await response.json();
  const subjects = Array.isArray(payload.data) ? payload.data : [];

  return subjects
    .filter((subject) => matchesBangumiCategory(subject, category))
    .map((subject) => mapBangumiSubject(subject, category, origin, genre))
    .filter(Boolean)
    .slice(0, RESULT_LIMIT);
};

export const mapMusicBrainzReleaseGroup = (releaseGroup, coverUrl, origin, genre) => {
  const title = String(releaseGroup.title ?? '').trim();
  if (!title || !coverUrl) return null;

  const artists = Array.isArray(releaseGroup['artist-credit'])
    ? releaseGroup['artist-credit'].map((credit) => credit.name).filter(Boolean)
    : [];

  return {
    id: `music-mb-${releaseGroup.id}`,
    titleZh: title,
    titleOriginal: title,
    aliases: artists,
    year: getYear(releaseGroup['first-release-date']),
    publisher: artists.join('、') || 'MusicBrainz',
    genre: String(genre || releaseGroup['primary-type'] || '音乐'),
    popularity: Number(releaseGroup.score ?? 0),
    imageUrl: imageProxyUrl(origin, coverUrl),
  };
};

const escapeMusicBrainzPhrase = (value) => String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"');

export const buildMusicBrainzQuery = (query, genre, decade) => {
  const clauses = ['primarytype:album'];
  if (query) clauses.unshift(`releasegroup:"${escapeMusicBrainzPhrase(query)}"`);
  if (musicGenreTags[genre]) clauses.push(`tag:"${musicGenreTags[genre]}"`);
  if (/^\d{4}s$/.test(decade)) {
    const startYear = Number.parseInt(decade, 10);
    clauses.push(`firstreleasedate:[${startYear}-01-01 TO ${startYear + 9}-12-31]`);
  }
  return clauses.join(' AND ');
};

const searchMusic = async (query, genre, decade, origin) => {
  const url = new URL(MUSICBRAINZ_SEARCH_URL);
  url.searchParams.set('query', buildMusicBrainzQuery(query, genre, decade));
  url.searchParams.set('fmt', 'json');
  url.searchParams.set('limit', String(RESULT_LIMIT));

  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': APP_USER_AGENT },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`MusicBrainz search failed: ${response.status}`);

  const payload = await response.json();
  const releaseGroups = Array.isArray(payload['release-groups']) ? payload['release-groups'] : [];
  const exactQuery = normalize(query);
  const ordered = [...releaseGroups].sort((a, b) => {
    const aExact = normalize(a.title) === exactQuery ? 1 : 0;
    const bExact = normalize(b.title) === exactQuery ? 1 : 0;
    const aAlbum = a['primary-type'] === 'Album' ? 1 : 0;
    const bAlbum = b['primary-type'] === 'Album' ? 1 : 0;
    return bExact - aExact || bAlbum - aAlbum || Number(b.score ?? 0) - Number(a.score ?? 0);
  });

  return ordered
    .map((item) => mapMusicBrainzReleaseGroup(
      item,
      `https://coverartarchive.org/release-group/${item.id}/front-500`,
      origin,
      genre,
    ))
    .filter(Boolean)
    .slice(0, RESULT_LIMIT);
};

export const searchCatalog = async (category, query, genre, decade, origin) => {
  const trimmedQuery = String(query ?? '').trim().slice(0, 80);
  const trimmedGenre = String(genre ?? '').trim().slice(0, 30);
  const trimmedDecade = String(decade ?? '').trim().slice(0, 5);
  if (category !== 'music' && !(category in bangumiTypeByCategory)) return [];

  const cacheKey = `${origin}|${category}|${normalize(trimmedQuery)}|${normalize(trimmedGenre)}|${trimmedDecade}`;
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.items;

  const items = category === 'music'
    ? await searchMusic(trimmedQuery, trimmedGenre, trimmedDecade, origin)
    : await searchBangumi(category, trimmedQuery, trimmedGenre, trimmedDecade, origin);

  searchCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, items });
  return items;
};

const allowedImageHost = (hostname) =>
  hostname === 'lain.bgm.tv'
  || hostname === 'coverartarchive.org'
  || hostname === 'archive.org'
  || hostname.endsWith('.archive.org');

const proxyImage = async (sourceUrl, response) => {
  let parsed;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    json(response, 400, { error: 'Invalid image URL' });
    return;
  }

  if (parsed.protocol !== 'https:' || !allowedImageHost(parsed.hostname)) {
    json(response, 400, { error: 'Image host is not allowed' });
    return;
  }

  const upstream = await fetch(parsed, {
    redirect: 'follow',
    headers: { Accept: 'image/*', 'User-Agent': APP_USER_AGENT },
    signal: AbortSignal.timeout(10000),
  });
  const finalUrl = new URL(upstream.url);
  const contentType = upstream.headers.get('content-type') ?? '';

  if (!upstream.ok || !allowedImageHost(finalUrl.hostname) || !contentType.startsWith('image/')) {
    json(response, 404, { error: 'Image is unavailable' });
    return;
  }

  const body = Buffer.from(await upstream.arrayBuffer());
  response.statusCode = 200;
  response.setHeader('Content-Type', contentType);
  response.setHeader('Content-Length', body.length);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  response.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  response.end(body);
};

export const handleCatalogApi = async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.end();
    return true;
  }

  if (request.method !== 'GET') {
    json(response, 405, { error: 'Method not allowed' });
    return true;
  }

  if (url.pathname === '/api/catalog/search') {
    try {
      const items = await searchCatalog(
        url.searchParams.get('category') ?? '',
        url.searchParams.get('q') ?? '',
        url.searchParams.get('genre') ?? '',
        url.searchParams.get('decade') ?? '',
        requestOrigin(request),
      );
      json(response, 200, { items });
    } catch (error) {
      json(response, 502, { error: error instanceof Error ? error.message : 'Search failed' });
    }
    return true;
  }

  if (url.pathname === '/api/catalog/image') {
    try {
      await proxyImage(url.searchParams.get('url') ?? '', response);
    } catch {
      json(response, 502, { error: 'Image proxy failed' });
    }
    return true;
  }

  return false;
};
