import { consoleCatalog } from '../data/extendedCatalogs';
import { CollectionExperience, type CollectionExperienceConfig } from './CollectionExperience';

const config: CollectionExperienceConfig = {
  variant: 'console',
  items: consoleCatalog,
  backgroundAsset: 'assets/themes/console-room.png',
  kicker: 'CONSOLE GAME COLLECTION',
  titleLines: ['陪我最久的', '九款主机游戏'],
  accentLine: 1,
  description: '有些冒险，只属于沙发、手柄和深夜。',
  startLabel: '开始选择',
  signatureLabel: '收藏柜署名',
  signaturePlaceholder: '比如：林川',
  previewSignature: '林川',
  itemLabel: '主机游戏',
  pickerTitle: '选择一款主机游戏',
  quickFilters: ['动作冒险', '角色扮演', '竞速', '合作冒险'],
  shareTitle: (signature) => `${signature}的主机收藏柜`,
  shareCaption: '那些并肩作战的夜晚，至今仍在按下开始键。',
  titleSuffix: '的九款主机游戏',
  posterBrand: 'CONSOLE COLLECTION · NO. 0009',
  posterSiteLabel: '偏爱 · 主机收藏柜',
  posterTheme: 'console',
  downloadName: 'console-collection.png',
};

export function ConsoleExperience() {
  return <CollectionExperience config={config} />;
}
