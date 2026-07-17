import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CatalogItem } from '../types';
import { GamePicker } from './GamePicker';

const onlineItem: CatalogItem = {
  id: 'drama-bgm-492991',
  titleZh: '难哄',
  titleOriginal: '难哄',
  aliases: [],
  year: 2025,
  publisher: '华语剧',
  genre: '爱情',
  popularity: 100,
  imageUrl: 'https://example.test/poster.jpg',
};

const electronicAlbum: CatalogItem = {
  ...onlineItem,
  id: 'music-mb-electronic-album',
  titleZh: 'Discovery',
  titleOriginal: 'Discovery',
  aliases: ['Daft Punk'],
  year: 2001,
  publisher: 'Daft Punk',
  genre: '电子',
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('GamePicker remote catalog search', () => {
  it('adds online results after the user enters a title', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [onlineItem] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <GamePicker
        open
        items={[]}
        title="选择一部剧"
        variant="drama"
        searchCategory="drama"
        genreOptions={[]}
        decadeOptions={[]}
        unavailableGameIds={new Set()}
        onClose={() => undefined}
        onSelect={() => undefined}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: '搜索名称或别名' }), { target: { value: '难哄' } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1), { timeout: 1500 });
    expect(await screen.findByRole('button', { name: '选择 难哄' })).toBeInTheDocument();
    expect(screen.getByText('找到 1 个结果')).toBeInTheDocument();
  });

  it('removes online results whose cover cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [onlineItem] }),
    }));

    const { container } = render(
      <GamePicker
        open
        items={[]}
        title="选择一部剧"
        variant="drama"
        searchCategory="drama"
        genreOptions={[]}
        decadeOptions={[]}
        unavailableGameIds={new Set()}
        onClose={() => undefined}
        onSelect={() => undefined}
      />,
    );

    fireEvent.change(screen.getByRole('textbox', { name: '搜索名称或别名' }), { target: { value: '难哄' } });
    await screen.findByRole('button', { name: '选择 难哄' });
    fireEvent.error(container.querySelector('.game-card img') as HTMLImageElement);

    await waitFor(() => expect(screen.queryByRole('button', { name: '选择 难哄' })).not.toBeInTheDocument());
    expect(screen.getByText('找到 0 个结果')).toBeInTheDocument();
  });

  it('browses the online music catalog when a genre is selected', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [electronicAlbum] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <GamePicker
        open
        items={[]}
        title="选择一张专辑"
        variant="music"
        searchCategory="music"
        genreOptions={[{ value: '电子', label: '电子' }]}
        decadeOptions={[]}
        unavailableGameIds={new Set()}
        onClose={() => undefined}
        onSelect={() => undefined}
      />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: '类型' }), { target: { value: '电子' } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1), { timeout: 1500 });
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('genre=%E7%94%B5%E5%AD%90');
    expect(await screen.findByRole('button', { name: '选择 Discovery' })).toBeInTheDocument();
  });
});
