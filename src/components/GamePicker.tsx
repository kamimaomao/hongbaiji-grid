import { useEffect, useMemo, useRef, useState } from 'react';
import type { FilterOption } from '../data/catalogs';
import { filterGames, sortGames, type DecadeFilter, type SortMode } from '../lib/search';
import type { FcGame, GameGenre } from '../types';

interface GamePickerProps {
  open: boolean;
  items: FcGame[];
  title: string;
  genreOptions: FilterOption[];
  decadeOptions: FilterOption[];
  unavailableGameIds: Set<string>;
  onClose: () => void;
  onSelect: (game: FcGame) => void;
}

export function GamePicker({
  open,
  items,
  title,
  genreOptions,
  decadeOptions,
  unavailableGameIds,
  onClose,
  onSelect,
}: GamePickerProps) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GameGenre | 'all'>('all');
  const [decade, setDecade] = useState<DecadeFilter>('all');
  const [sort, setSort] = useState<SortMode>('popularity');
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

  const games = useMemo(() => {
    const filtered = filterGames(items, { query, genre, decade });
    return sortGames(filtered, sort);
  }, [items, query, genre, decade, sort]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="picker" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
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
                  <img className="cover-backdrop" src={game.imageUrl} alt="" loading="lazy" decoding="async" />
                  <img className="cover-art" src={game.imageUrl} alt="" loading="lazy" decoding="async" />
                </span>
                <strong>{game.titleZh}</strong>
                <span>
                  {isUnavailable ? '已选择' : `${game.year} · ${game.publisher}`}
                </span>
              </button>
            );
          })}
        </div>
        <p className="result-count">找到 {games.length} 个结果</p>
      </section>
    </div>
  );
}
