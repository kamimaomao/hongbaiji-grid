import rawCatalogs from './generated/extended-catalogs.json';
import type { CatalogItem } from '../types';

interface RawCatalogItem extends Omit<CatalogItem, 'imageUrl'> {
  imagePath: string;
  sourceUrl: string;
}

const hydrate = (items: RawCatalogItem[]): CatalogItem[] =>
  items.map(({ imagePath, ...item }) => ({
    ...item,
    imageUrl: `${import.meta.env.BASE_URL}${imagePath}`,
  }));

export const movieCatalog = hydrate(rawCatalogs.movie);
export const classicDramaCatalog = hydrate(rawCatalogs.classicDrama);
export const pcCatalog = hydrate(rawCatalogs.pc);
export const consoleCatalog = hydrate(rawCatalogs.console);
export const boardgameCatalog = hydrate(rawCatalogs.boardgame);
