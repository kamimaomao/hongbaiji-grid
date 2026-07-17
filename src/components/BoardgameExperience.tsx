import { boardgameCatalog } from '../data/extendedCatalogs';
import { CollectionExperience, type CollectionExperienceConfig } from './CollectionExperience';

const config: CollectionExperienceConfig = {
  variant: 'boardgame',
  items: boardgameCatalog,
  backgroundAsset: 'assets/themes/boardgame-table.png',
  kicker: 'WEEKEND TABLE PICKS',
  titleLines: ['最想再开一局的', '九款桌游'],
  accentLine: 1,
  description: '有些好局，散场以后还会一直被提起。',
  startLabel: '开始选择',
  signatureLabel: '桌局署名',
  signaturePlaceholder: '比如：七喜',
  previewSignature: '七喜',
  itemLabel: '桌游',
  pickerTitle: '选择一款桌游',
  quickFilters: ['双人', '竞速', '策略', '合作'],
  shareTitle: (signature) => `${signature}的周末桌局`,
  shareCaption: '一场好局，胜过所有计划。',
  titleSuffix: '最想再开一局的九款桌游',
  posterBrand: 'WEEKEND TABLE PICKS',
  posterSiteLabel: '偏爱 · 周末桌局',
  posterTheme: 'boardgame',
  downloadName: 'weekend-boardgames.png',
};

export function BoardgameExperience() {
  return <CollectionExperience config={config} />;
}
