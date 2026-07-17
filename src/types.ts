export type GameGenre = string;

export interface CatalogItem {
  id: string;
  titleZh: string;
  titleOriginal: string;
  aliases: string[];
  year: number;
  publisher: string;
  genre: GameGenre;
  popularity: number;
  imageUrl: string;
}

export type FcGame = CatalogItem;

export interface SelectedGameSnapshot {
  id: string;
  titleZh: string;
  titleOriginal: string;
  year: number;
  publisher: string;
  imageUrl: string;
}

export type GridSelection = Array<SelectedGameSnapshot | null>;

export type CatalogMode = 'fc' | 'anime';

export type CollectionVariant = 'movie' | 'classic-drama' | 'fc' | 'pc' | 'console' | 'boardgame';

export type RemoteCatalogCategory = 'music' | 'movie' | 'drama' | 'classic-drama' | 'anime' | 'fc' | 'pc' | 'console' | 'boardgame';
