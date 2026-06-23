import { useEffect, useMemo, useState } from 'react';
import { fcGames } from '../data/fcGames';
import { filterGames, sortGames, type DecadeFilter, type SortMode } from '../lib/search';
import type { FcGame, GameGenre } from '../types';

interface GamePickerProps {
  open: boolean;
  unavailableGameIds: Set<string>;
  onClose: () => void;
  onSelect: (game: FcGame) => void;
}

export function GamePicker({ open, unavailableGameIds, onClose, onSelect }: GamePickerProps) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GameGenre | 'all'>('all');
  const [decade, setDecade] = useState<DecadeFilter>('all');
  const [sort, setSort] = useState<SortMode>('popularity');

  useEffect(() => {
    if (open) {
      setQuery('');
    }
  }, [open]);

  const games = useMemo(() => {
    const filtered = filterGames(fcGames, { query, genre, decade });
    return sortGames(filtered, sort);
  }, [query, genre, decade, sort]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <section className="picker" role="dialog" aria-modal="true" aria-label="选择红白机游戏">
        <div className="picker-header">
          <h2>选择红白机游戏</h2>
          <button type="button" onClick={onClose}>
            关闭
          </button>
        </div>

        <input
          className="search-input"
          value={query}
          placeholder="搜索中文名、英文名或别名"
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="filters">
          <select aria-label="类型" value={genre} onChange={(event) => setGenre(event.target.value as GameGenre | 'all')}>
            <option value="all">全部类型</option>
            <option value="动作">动作</option>
            <option value="射击">射击</option>
            <option value="角色扮演">角色扮演</option>
            <option value="体育">体育</option>
            <option value="益智">益智</option>
          </select>
          <select aria-label="年代" value={decade} onChange={(event) => setDecade(event.target.value as DecadeFilter)}>
            <option value="all">全部年代</option>
            <option value="1980s">80 年代</option>
            <option value="1990s">90 年代</option>
          </select>
          <select aria-label="排序" value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
            <option value="popularity">热度</option>
            <option value="year-asc">年份从早到晚</option>
            <option value="year-desc">年份从晚到早</option>
            <option value="title">中文名</option>
          </select>
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
                  <img className="cover-backdrop" src={game.imageUrl} alt="" />
                  <img className="cover-art" src={game.imageUrl} alt="" />
                </span>
                <strong>{game.titleZh}</strong>
                <span>
                  {isUnavailable ? '已选择' : `${game.year} · ${game.publisher}`}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
