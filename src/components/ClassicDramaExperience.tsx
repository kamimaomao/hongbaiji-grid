import { classicDramaCatalog } from '../data/extendedCatalogs';
import type { ReactNode } from 'react';
import { CollectionExperience, type CollectionExperienceConfig } from './CollectionExperience';

const prompts = [
  { id: 'favorite', index: '01', label: '九部最爱', titleSuffix: '的青春剧单' },
  { id: 'unfinished', index: '02', label: '最意难平', titleSuffix: '最意难平的九部剧' },
  { id: 'rewatch', index: '03', label: '最想重看', titleSuffix: '最想重看的九部经典剧' },
  { id: 'quotes', index: '04', label: '最会背台词', titleSuffix: '最会背台词的九部剧' },
];

const config: CollectionExperienceConfig = {
  variant: 'classic-drama',
  items: classicDramaCatalog,
  backgroundAsset: 'assets/themes/classic-drama-paper.png',
  kicker: 'CLASSIC DRAMA · YOUTH PLAYLIST',
  titleLines: ['OST一响，', '就回到那一年'],
  accentLine: 0,
  description: '选出陪你长大的九部经典剧集。',
  startLabel: '开始选剧',
  signatureLabel: '封面署名',
  signaturePlaceholder: '比如：小雨',
  previewSignature: '小雨',
  itemLabel: '经典剧集',
  pickerTitle: '选择一部经典剧集',
  quickFilters: ['青春爱情', '偶像爱情', '都市爱情', '偶像喜剧'],
  shareTitle: (signature, prompt) => `${signature}的${prompt?.label ?? '青春剧单'}`,
  shareCaption: '那些年，我们一起追过的青春。',
  titleSuffix: '的青春剧单',
  posterBrand: 'CLASSIC DRAMA MAGAZINE · 2000s',
  posterSiteLabel: '偏爱 · 青春剧单',
  posterTheme: 'classic-drama',
  downloadName: 'classic-drama-list.png',
  prompts,
};

interface ClassicDramaExperienceProps {
  headerSlot: ReactNode;
}

export function ClassicDramaExperience({ headerSlot }: ClassicDramaExperienceProps) {
  return <CollectionExperience config={config} headerSlot={headerSlot} />;
}
