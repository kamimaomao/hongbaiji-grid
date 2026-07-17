import { pcCatalog } from '../data/extendedCatalogs';
import { CollectionExperience, type CollectionExperienceConfig } from './CollectionExperience';

const config: CollectionExperienceConfig = {
  variant: 'pc',
  items: pcCatalog,
  backgroundAsset: 'assets/themes/pc-room.png',
  kicker: 'PERSONAL COMPUTER ARCHIVE',
  titleLines: ['我的PC游戏', '年代史'],
  accentLine: 1,
  description: '从第一次开机，到今天的游戏库，留下最重要的九款。',
  startLabel: '开始选择',
  signatureLabel: '档案署名',
  signaturePlaceholder: '比如：老周',
  previewSignature: '老周',
  itemLabel: 'PC游戏',
  pickerTitle: '选择一款PC游戏',
  quickFilters: ['即时战略', '角色扮演', '射击', '模拟'],
  shareTitle: (signature) => `${signature}的PC游戏年代史`,
  shareCaption: '文明进步，从备份开始。',
  titleSuffix: '的PC游戏年代史',
  posterBrand: 'PERSONAL COMPUTER ARCHIVE',
  posterSiteLabel: '偏爱 · PC游戏年代史',
  posterTheme: 'pc',
  downloadName: 'pc-game-history.png',
};

export function PcExperience() {
  return <CollectionExperience config={config} />;
}
