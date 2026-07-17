import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const coverDirectory = resolve(projectRoot, 'public/covers/drama');
const manifestPath = resolve(projectRoot, 'src/data/generated/drama-poster-sources.json');

const posters = [
  { title: '难哄', year: 2025, tmdbId: 250060, posterPath: 'cTYyp5ggqQhr264P1tXTB6rwjKl.jpg', fileName: 'first-frost.jpg' },
  { title: '国色芳华', year: 2025, tmdbId: 243083, posterPath: 'cYj4eu6jtP65C6Rcm4udnxzhVgD.jpg', fileName: 'flourished-peony.jpg' },
  { title: '棋士', year: 2025, tmdbId: 258490, posterPath: '1Q16z9yXH9tlCq6yz5Td65wsfob.jpg', fileName: 'playing-go.jpg' },
  { title: '墨雨云间', year: 2024, tmdbId: 236033, posterPath: 'cMWp9kq1QvVntGUMtLOnPdHTqWp.jpg', fileName: 'the-double.jpg' },
  { title: '当我飞奔向你', year: 2023, tmdbId: 228547, posterPath: '4rcykytUTISe2aQR6WTzC0vRitC.jpg', fileName: 'when-i-fly.jpg' },
  { title: '长相思', year: 2023, tmdbId: 210524, posterPath: 'sIWIB7Q6vsU3b4ULoa6a1kq7SXg.jpg', fileName: 'lost-you-forever.jpg' },
  { title: '隐秘的角落', year: 2020, tmdbId: 104960, posterPath: 'zlaml7IKAIPa3NJE9LhRveELD0v.jpg', fileName: 'bad-kids.jpg' },
  { title: '漫长的季节', year: 2023, tmdbId: 225008, posterPath: 'tJLiKDYdfMskFkJXV1HnaQAdpGf.jpg', fileName: 'long-season.jpg' },
  { title: '偷偷藏不住', year: 2023, tmdbId: 210733, posterPath: 'aMyypY2MhgXeYAuwUXPFH49MkOb.jpg', fileName: 'hidden-love.jpg' },
  { title: '开端', year: 2022, tmdbId: 155441, posterPath: '3vbovxhpmrHbz3Ot9AhzLziaxTO.jpg', fileName: 'reset.jpg' },
  { title: '去有风的地方', year: 2023, tmdbId: 216424, posterPath: 'qaYfoLzWtOLaVoNvOeNBZYIjo1V.jpg', fileName: 'meet-yourself.jpg' },
  { title: '繁花', year: 2023, tmdbId: 106841, posterPath: 'rV1owsdKtXytJ5eFMOOVTze3mrk.jpg', fileName: 'blossoms.jpg' },
];

await mkdir(coverDirectory, { recursive: true });
await mkdir(dirname(manifestPath), { recursive: true });

for (const poster of posters) {
  const imageUrl = `https://image.tmdb.org/t/p/w780/${poster.posterPath}`;
  const response = await fetch(imageUrl, { headers: { Accept: 'image/*' } });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
    throw new Error(`Failed to download ${poster.title}: ${response.status}`);
  }

  await writeFile(resolve(coverDirectory, poster.fileName), Buffer.from(await response.arrayBuffer()));
  process.stdout.write(`downloaded ${poster.title}\n`);
}

const manifest = posters.map((poster) => ({
  title: poster.title,
  year: poster.year,
  file: `covers/drama/${poster.fileName}`,
  source: `https://www.themoviedb.org/tv/${poster.tmdbId}?language=zh-CN`,
  image: `https://image.tmdb.org/t/p/w780/${poster.posterPath}`,
}));

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
