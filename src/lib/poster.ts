import type { SelectedGameSnapshot } from '../types';
import { getPosterTitle } from './selection';

interface PosterOptions {
  signature: string;
  games: SelectedGameSnapshot[];
  siteLabel: string;
  titleSuffix?: string;
  brandLabel?: string;
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
}: PosterOptions) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not available');
  }

  context.fillStyle = '#221f1a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#d49b6a';
  context.font = '700 36px sans-serif';
  context.fillText(brandLabel, 72, 96);

  context.fillStyle = '#f8f0df';
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

    context.fillStyle = '#3a342d';
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

    context.strokeStyle = 'rgba(248, 240, 223, 0.22)';
    context.lineWidth = 3;
    context.strokeRect(x + 1.5, y + 1.5, cell - 3, cell - 3);

    context.fillStyle = 'rgba(0, 0, 0, 0.68)';
    context.fillRect(x, y + cell - 58, cell, 58);
    context.fillStyle = '#fffaf2';
    context.font = '700 28px sans-serif';
    context.fillText(game.titleZh, x + 16, y + cell - 20);
  }

  context.fillStyle = '#b9aa94';
  context.font = '500 30px sans-serif';
  context.fillText(siteLabel, 72, 1352);

  return canvas.toDataURL('image/png');
}
