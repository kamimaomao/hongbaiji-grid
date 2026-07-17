import type { CatalogItem, RemoteCatalogCategory } from '../types';

const RAILWAY_API_ORIGIN = 'https://hongbaiji-grid-production.up.railway.app';

const getApiOrigin = () => window.location.hostname.endsWith('github.io') ? RAILWAY_API_ORIGIN : '';

const isCatalogItem = (value: unknown): value is CatalogItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CatalogItem>;
  return typeof item.id === 'string'
    && typeof item.titleZh === 'string'
    && typeof item.titleOriginal === 'string'
    && Array.isArray(item.aliases)
    && typeof item.year === 'number'
    && typeof item.publisher === 'string'
    && typeof item.genre === 'string'
    && typeof item.popularity === 'number'
    && typeof item.imageUrl === 'string';
};

export async function searchRemoteCatalog(
  category: RemoteCatalogCategory,
  query: string,
  genre: string,
  decade: string,
  signal?: AbortSignal,
) {
  const url = new URL(`${getApiOrigin()}/api/catalog/search`, window.location.origin);
  url.searchParams.set('category', category);
  url.searchParams.set('q', query.trim());
  if (genre !== 'all') url.searchParams.set('genre', genre);
  if (decade !== 'all') url.searchParams.set('decade', decade);

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Remote catalog search failed: ${response.status}`);
  const payload = await response.json() as { items?: unknown[] };
  return Array.isArray(payload.items) ? payload.items.filter(isCatalogItem) : [];
}
