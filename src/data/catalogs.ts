import type { CatalogMode, FcGame } from '../types';

export interface FilterOption {
  value: string;
  label: string;
}

export interface CatalogConfig {
  mode: CatalogMode;
  navLabel: string;
  eyebrow: string;
  heading: string;
  pickerTitle: string;
  gridLabel: string;
  slotItemLabel: string;
  titleSuffix: string;
  posterBrand: string;
  siteLabel: string;
  downloadName: string;
}

export const catalogConfigs: Record<CatalogMode, CatalogConfig> = {
  fc: {
    mode: 'fc',
    navLabel: '红白机游戏',
    eyebrow: '红白机九宫格',
    heading: '选出你最喜欢的红白机游戏',
    pickerTitle: '选择红白机游戏',
    gridLabel: '红白机游戏九宫格',
    slotItemLabel: '红白机游戏',
    titleSuffix: '最喜欢的红白机游戏',
    posterBrand: 'FAMICOM NINE GRID',
    siteLabel: 'hongbaiji-grid · 我也来选',
    downloadName: 'fc-nine-grid.png',
  },
  anime: {
    mode: 'anime',
    navLabel: '日本动漫',
    eyebrow: '日本动漫九宫格',
    heading: '选出你最喜欢的九部日本动漫',
    pickerTitle: '选择日本动漫',
    gridLabel: '日本动漫九宫格',
    slotItemLabel: '日本动漫',
    titleSuffix: '最喜欢的九部日本动漫',
    posterBrand: 'ANIME NINE GRID',
    siteLabel: 'hongbaiji-grid · 我也来选',
    downloadName: 'anime-nine-grid.png',
  },
};

const toDecade = (year: number) => `${Math.floor(year / 10) * 10}s`;

const formatDecade = (decade: string) => {
  const startYear = Number.parseInt(decade, 10);
  if (!Number.isFinite(startYear)) return decade;
  if (startYear >= 2000) return `${startYear} 年代`;
  return `${String(startYear).slice(2)} 年代`;
};

export const getGenreOptions = (items: FcGame[]): FilterOption[] =>
  Array.from(new Set(items.map((item) => item.genre)))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .map((genre) => ({ value: genre, label: genre }));

export const getDecadeOptions = (items: FcGame[]): FilterOption[] =>
  Array.from(new Set(items.map((item) => toDecade(item.year))))
    .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10))
    .map((decade) => ({ value: decade, label: formatDecade(decade) }));
