import type { CatalogItem, SelectedGameSnapshot } from '../types';
import { getPosterTitle } from './selection';

interface PosterOptions {
  signature: string;
  games: SelectedGameSnapshot[];
  siteLabel: string;
  titleSuffix?: string;
  brandLabel?: string;
  theme?: PosterTheme;
}

export type PosterTheme = 'classic' | 'music' | 'drama' | 'movie' | 'classic-drama' | 'fc' | 'pc' | 'console' | 'boardgame';

interface DuelPosterOptions {
  signature: string;
  champion: CatalogItem;
  topFour: CatalogItem[];
  eliminated: CatalogItem[];
}

export const buildPosterTitle = (signature: string, titleSuffix?: string) => getPosterTitle(signature, titleSuffix);

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image failed to load: ${src}`));
    image.src = src;
  });

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const chars = [...text];
  const lines: string[] = [];
  let line = '';

  for (const char of chars) {
    const next = line + char;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, 2);
};

const drawImageCover = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  const sourceWidth = sourceRatio > targetRatio ? image.naturalHeight * targetRatio : image.naturalWidth;
  const sourceHeight = sourceRatio > targetRatio ? image.naturalHeight : image.naturalWidth / targetRatio;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
};

const drawImageContain = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
};

export async function generatePosterDataUrl({
  signature,
  games,
  siteLabel,
  titleSuffix,
  brandLabel = 'FAMICOM NINE GRID',
  theme = 'classic',
}: PosterOptions) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not available');
  }

  const palettes: Record<PosterTheme, { background: string; accent: string; title: string; cell: string; label: string; footer: string }> = {
    classic: { background: '#221f1a', accent: '#d49b6a', title: '#f8f0df', cell: '#3a342d', label: 'rgba(0, 0, 0, 0.68)', footer: '#b9aa94' },
    music: { background: '#0d0b09', accent: '#2f6df6', title: '#f4eee3', cell: '#201b16', label: 'rgba(0, 0, 0, 0.76)', footer: '#bca989' },
    drama: { background: '#f7f3ea', accent: '#ff574f', title: '#151515', cell: '#dbeee5', label: 'rgba(12, 12, 12, 0.78)', footer: '#358c78' },
    movie: { background: '#160b0a', accent: '#c5533d', title: '#ead9b8', cell: '#251310', label: 'rgba(20, 8, 6, 0.82)', footer: '#c7a77a' },
    'classic-drama': { background: '#ece9f5', accent: '#d94365', title: '#37325f', cell: '#d9e5f2', label: 'rgba(55, 50, 95, 0.82)', footer: '#6563a6' },
    fc: { background: '#17120e', accent: '#b52e22', title: '#f2e8d4', cell: '#2d251c', label: 'rgba(18, 12, 8, 0.82)', footer: '#bba98f' },
    pc: { background: '#101411', accent: '#3dd1cf', title: '#f1ead9', cell: '#17201d', label: 'rgba(4, 15, 13, 0.84)', footer: '#6fd3ca' },
    console: { background: '#111214', accent: '#356df3', title: '#f4f4f0', cell: '#1d2026', label: 'rgba(8, 10, 15, 0.84)', footer: '#8aa7ee' },
    boardgame: { background: '#142219', accent: '#c84939', title: '#efe4ce', cell: '#26382d', label: 'rgba(12, 27, 17, 0.84)', footer: '#c9ad7f' },
  };
  const colors = palettes[theme];

  context.fillStyle = colors.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = colors.accent;
  context.font = '700 36px sans-serif';
  context.fillText(brandLabel, 72, 96);

  context.fillStyle = colors.title;
  context.font = '900 82px sans-serif';
  const titleLines = wrapText(context, buildPosterTitle(signature, titleSuffix), 760);
  titleLines.forEach((line, index) => context.fillText(line, 72, 180 + index * 92));

  const images = await Promise.all(
    games.map(async (game) => {
      try {
        return await loadImage(game.imageUrl);
      } catch {
        return null;
      }
    }),
  );

  const gridTop = 380;
  const gap = 18;
  const cell = 300;

  for (let index = 0; index < 9; index += 1) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = 72 + col * (cell + gap);
    const y = gridTop + row * (cell + gap);
    const image = images[index];
    const game = games[index];

    context.fillStyle = colors.cell;
    context.fillRect(x, y, cell, cell);

    if (image) {
      context.save();
      context.beginPath();
      context.rect(x, y, cell, cell);
      context.clip();
      context.filter = 'blur(18px) saturate(1.18)';
      drawImageCover(context, image, x - 22, y - 22, cell + 44, cell + 44);
      context.filter = 'none';
      context.fillStyle = 'rgba(34, 31, 26, 0.2)';
      context.fillRect(x, y, cell, cell);
      drawImageContain(context, image, x + 22, y + 20, cell - 44, cell - 56);
      context.restore();
    }

    context.strokeStyle = theme === 'drama' || theme === 'classic-drama' ? 'rgba(12, 12, 12, 0.2)' : 'rgba(248, 240, 223, 0.22)';
    context.lineWidth = 3;
    context.strokeRect(x + 1.5, y + 1.5, cell - 3, cell - 3);

    context.fillStyle = colors.label;
    context.fillRect(x, y + cell - 58, cell, 58);
    context.fillStyle = '#fffaf2';
    context.font = '700 28px sans-serif';
    context.fillText(game.titleZh, x + 16, y + cell - 20);
  }

  context.fillStyle = colors.footer;
  context.font = '500 30px sans-serif';
  context.fillText(siteLabel, 72, 1352);

  return canvas.toDataURL('image/png');
}

export async function generateDuelPosterDataUrl({ signature, champion, topFour, eliminated }: DuelPosterOptions) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available');

  context.fillStyle = '#0b0b0b';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#f8b800';
  context.fillRect(0, 0, canvas.width, 214);
  context.fillStyle = '#111111';
  context.font = '900 38px sans-serif';
  context.fillText(`${signature.trim() || '我的'}的`, 64, 70);
  context.font = '900 82px sans-serif';
  context.fillText('动漫冠军', 64, 158);
  context.font = '800 26px sans-serif';
  context.fillText('FAVORITE DUEL · CHAMPION', 64, 198);

  const championImage = await loadImage(champion.imageUrl).catch(() => null);
  context.fillStyle = '#202020';
  context.fillRect(64, 254, 952, 720);
  if (championImage) drawImageCover(context, championImage, 64, 254, 952, 720);
  context.fillStyle = 'rgba(0, 0, 0, 0.78)';
  context.fillRect(64, 826, 952, 148);
  context.fillStyle = '#f8b800';
  context.font = '900 28px sans-serif';
  context.fillText('NO. 1 · CHAMPION', 92, 872);
  context.fillStyle = '#ffffff';
  context.font = '900 58px sans-serif';
  context.fillText(champion.titleZh, 92, 940);

  context.fillStyle = '#f8b800';
  context.font = '900 26px sans-serif';
  context.fillText('TOP 4', 64, 1032);

  const topImages = await Promise.all(topFour.slice(0, 4).map((item) => loadImage(item.imageUrl).catch(() => null)));
  const cardWidth = 220;
  for (let index = 0; index < 4; index += 1) {
    const x = 64 + index * 238;
    context.fillStyle = '#242424';
    context.fillRect(x, 1054, cardWidth, 244);
    if (topImages[index]) drawImageCover(context, topImages[index] as HTMLImageElement, x, 1054, cardWidth, 184);
    context.fillStyle = index === 0 ? '#f8b800' : '#ef3e2f';
    context.fillRect(x, 1054, 44, 42);
    context.fillStyle = '#101010';
    context.font = '900 23px sans-serif';
    context.fillText(String(index + 1), x + 15, 1084);
    context.fillStyle = '#ffffff';
    context.font = '700 18px sans-serif';
    context.fillText(topFour[index]?.titleZh ?? '', x + 10, 1276);
  }

  context.fillStyle = '#8d8d8d';
  context.font = '600 20px sans-serif';
  context.fillText(`淘汰了 ${eliminated.length} 部依然很爱的作品`, 64, 1360);
  context.fillStyle = '#f8b800';
  context.fillText('偏爱 · 为每一种热爱全力以赴', 662, 1360);
  return canvas.toDataURL('image/png');
}
