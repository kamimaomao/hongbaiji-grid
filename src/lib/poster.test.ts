import { describe, expect, it, vi } from 'vitest';
import { fcGames } from '../data/fcGames';
import { buildPosterTitle, generatePosterDataUrl } from './poster';
import { toSnapshot } from './selection';

describe('poster generation', () => {
  it('builds the title used on the image', () => {
    expect(buildPosterTitle('阿明')).toBe('阿明最喜欢的红白机游戏');
    expect(buildPosterTitle('')).toBe('我最喜欢的红白机游戏');
  });

  it('returns a png data url when canvas is available', async () => {
    const context = {
      fillRect: vi.fn(),
      fillText: vi.fn(),
      strokeRect: vi.fn(),
      drawImage: vi.fn(),
      measureText: vi.fn(() => ({ width: 80 })),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => context,
          toDataURL: () => 'data:image/png;base64,test',
        } as unknown as HTMLCanvasElement;
      }
      return document.createElement(tagName);
    });

    const image = await generatePosterDataUrl({
      signature: '阿明',
      games: fcGames.slice(0, 9).map(toSnapshot),
      siteLabel: 'fc-grid.fun · 我也来选',
    });

    expect(image).toBe('data:image/png;base64,test');
  });
});
