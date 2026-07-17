import { useEffect, useMemo, useRef, useState } from 'react';
import type { FilterOption } from '../data/catalogs';
import { searchRemoteCatalog } from '../lib/remoteCatalog';
import { filterGames, sortGames, type DecadeFilter, type SortMode } from '../lib/search';
import type { CollectionVariant, FcGame, GameGenre, RemoteCatalogCategory } from '../types';

interface GamePickerProps {
  open: boolean;
  items: FcGame[];
  title: string;
  variant?: 'default' | 'music' | 'drama' | CollectionVariant;
  initialGenre?: GameGenre | 'all';
  genreOptions: FilterOption[];
  decadeOptions: FilterOption[];
  searchCategory?: RemoteCatalogCategory;
  unavailableGameIds: Set<string>;
  onClose: () => void;
  onSelect: (game: FcGame) => void;
}

export function GamePicker({
  open,
  items,
  title,
  variant = 'default',
  initialGenre = 'all',
  genreOptions,
  decadeOptions,
  searchCategory,
  unavailableGameIds,
  onClose,
  onSelect,
}: GamePickerProps) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GameGenre | 'all'>(initialGenre);
  const [decade, setDecade] = useState<DecadeFilter>('all');
  const [sort, setSort] = useState<SortMode>('popularity');
  const [remoteItems, setRemoteItems] = useState<FcGame[]>([]);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());
  const [remoteStatus, setRemoteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const focusFrame = requestAnimationFrame(() => searchRef.current?.focus());
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    const canBrowseMusic = searchCategory === 'music' && (genre !== 'all' || decade !== 'all');
    if (!open || !searchCategory || (trimmedQuery.length < 2 && !canBrowseMusic)) {
      setRemoteItems([]);
      setRemoteStatus('idle');
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setRemoteStatus('loading');
      try {
        setRemoteItems(await searchRemoteCatalog(searchCategory, trimmedQuery, genre, decade, controller.signal));
        setRemoteStatus('success');
      } catch (error) {
        if (controller.signal.aborted) return;
        setRemoteItems([]);
        setRemoteStatus('error');
      }
    }, 320);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query, genre, decade, searchCategory]);

  const games = useMemo(() => {
    const localItems = filterGames(items, { query, genre, decade });
    const onlineItems = filterGames(remoteItems, { query, genre, decade });
    const merged = new Map<string, FcGame>();

    for (const game of [...localItems, ...onlineItems]) {
      if (failedImageIds.has(game.id)) continue;
      const key = `${game.titleZh.trim().toLocaleLowerCase('zh-CN')}|${game.year}`;
      if (!merged.has(key)) merged.set(key, game);
    }

    return sortGames([...merged.values()], sort);
  }, [items, remoteItems, failedImageIds, query, genre, decade, sort]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className={`picker picker-${variant}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="picker-controls">
          <div className="picker-header">
            <div>
              <p>选择内容</p>
              <h2>{title}</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="关闭选择器">
              完成
            </button>
          </div>

          <input
            ref={searchRef}
            className="search-input"
            aria-label="搜索名称或别名"
            value={query}
            placeholder="搜索名称或别名"
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="filters">
            <select aria-label="类型" value={genre} onChange={(event) => setGenre(event.target.value as GameGenre | 'all')}>
              <option value="all">全部类型</option>
              {genreOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select aria-label="年代" value={decade} onChange={(event) => setDecade(event.target.value as DecadeFilter)}>
              <option value="all">全部年代</option>
              {decadeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select aria-label="排序" value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="popularity">按热度排序</option>
              <option value="year-asc">年份从早到晚</option>
              <option value="year-desc">年份从晚到早</option>
              <option value="title">按中文名排序</option>
            </select>
          </div>
        </div>

        <div className="game-list">
          {games.map((game) => {
            const isUnavailable = unavailableGameIds.has(game.id);
            return (
              <button
                key={game.id}
                type="button"
                className={`game-card ${isUnavailable ? 'is-unavailable' : ''}`}
                disabled={isUnavailable}
                onClick={() => onSelect(game)}
                aria-label={isUnavailable ? `已选择 ${game.titleZh}` : `选择 ${game.titleZh}`}
              >
                <span className="cover-frame" aria-hidden="true">
                  <img
                    className="cover-backdrop"
                    src={game.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedImageIds((current) => new Set(current).add(game.id))}
                  />
                  <img
                    className="cover-art"
                    src={game.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedImageIds((current) => new Set(current).add(game.id))}
                  />
                </span>
                <strong>{game.titleZh}</strong>
                <span>
                  {isUnavailable ? '已选择' : `${game.year || '年份未知'} · ${game.publisher}`}
                </span>
              </button>
            );
          })}
        </div>
        <p className="result-count">
          {remoteStatus === 'loading'
            ? '正在搜索更多结果…'
            : remoteStatus === 'error'
              ? `联网搜索暂不可用 · 已显示 ${games.length} 个结果`
              : `找到 ${games.length} 个结果`}
        </p>
      </section>
    </div>
  );
}
