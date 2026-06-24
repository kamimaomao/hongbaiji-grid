import { describe, expect, it } from 'vitest';
import { fcGames } from '../data/fcGames';
import { createEmptyGrid, getPosterTitle, isGridComplete, toSnapshot, updateSlot } from './selection';

describe('selection helpers', () => {
  it('creates a 9-slot empty grid', () => {
    expect(createEmptyGrid()).toEqual([null, null, null, null, null, null, null, null, null]);
  });

  it('updates one slot without changing other slots', () => {
    const grid = createEmptyGrid();
    const updated = updateSlot(grid, 3, toSnapshot(fcGames[0]));
    expect(updated[3]?.id).toBe('super-mario-bros');
    expect(grid[3]).toBeNull();
  });

  it('knows when all 9 slots are filled', () => {
    const complete = createEmptyGrid().map((_, index) => toSnapshot(fcGames[index]));
    expect(isGridComplete(complete)).toBe(true);
    expect(isGridComplete(updateSlot(complete, 4, null))).toBe(false);
  });

  it('formats poster titles with optional signature', () => {
    expect(getPosterTitle('')).toBe('我最喜欢的红白机游戏');
    expect(getPosterTitle('  阿明  ')).toBe('阿明最喜欢的红白机游戏');
    expect(getPosterTitle('abcdefghijklmnop')).toBe('abcdefghijkl最喜欢的红白机游戏');
    expect(getPosterTitle('小林', '最喜欢的九部日本动漫')).toBe('小林最喜欢的九部日本动漫');
  });
});
