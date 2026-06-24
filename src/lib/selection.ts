import type { FcGame, GridSelection, SelectedGameSnapshot } from '../types';

export const MAX_SIGNATURE_LENGTH = 12;

export const createEmptyGrid = (): GridSelection => Array.from({ length: 9 }, () => null);

export const toSnapshot = (game: FcGame): SelectedGameSnapshot => ({
  id: game.id,
  titleZh: game.titleZh,
  titleOriginal: game.titleOriginal,
  year: game.year,
  publisher: game.publisher,
  imageUrl: game.imageUrl,
});

export const updateSlot = (
  grid: GridSelection,
  slotIndex: number,
  game: SelectedGameSnapshot | null,
): GridSelection => {
  if (slotIndex < 0 || slotIndex > 8) {
    return grid;
  }

  return grid.map((slot, index) => (index === slotIndex ? game : slot));
};

export const isGridComplete = (grid: GridSelection) => grid.length === 9 && grid.every(Boolean);

export const normalizeSignature = (signature: string) =>
  signature.trim().slice(0, MAX_SIGNATURE_LENGTH);

export const getPosterTitle = (signature: string, titleSuffix = '最喜欢的红白机游戏') => {
  const normalized = normalizeSignature(signature);
  return normalized ? `${normalized}${titleSuffix}` : `我${titleSuffix}`;
};
