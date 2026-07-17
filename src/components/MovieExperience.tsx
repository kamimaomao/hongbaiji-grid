import { movieCatalog } from '../data/extendedCatalogs';
import { CollectionExperience, type CollectionExperienceConfig } from './CollectionExperience';

const config: CollectionExperienceConfig = {
  variant: 'movie',
  items: movieCatalog,
  backgroundAsset: 'assets/themes/movie-cinema.png',
  kicker: 'PRIVATE FILM FESTIVAL',
  titleLines: ['选出组成你的', '九部电影'],
  accentLine: 1,
  description: '哪九部电影，最终变成了你的一部分？',
  startLabel: '开始选择',
  signatureLabel: '海报署名',
  signaturePlaceholder: '比如：阿诚',
  previewSignature: '阿诚',
  itemLabel: '电影',
  pickerTitle: '选择一部电影',
  quickFilters: ['剧情', '科幻', '爱情', '犯罪'],
  shareTitle: (signature) => `${signature}的私人电影节`,
  shareCaption: '有些故事，改变了我们看世界的方式。',
  titleSuffix: '的九部人生电影',
  posterBrand: 'PRIVATE FILM FESTIVAL',
  posterSiteLabel: '偏爱 · 私人电影节',
  posterTheme: 'movie',
  downloadName: 'favorite-movies.png',
};

export function MovieExperience() {
  return <CollectionExperience config={config} />;
}
