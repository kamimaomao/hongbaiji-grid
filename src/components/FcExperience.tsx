import { fcGames } from '../data/fcGames';
import { CollectionExperience, type CollectionExperienceConfig } from './CollectionExperience';

const config: CollectionExperienceConfig = {
  variant: 'fc',
  items: fcGames,
  backgroundAsset: 'assets/themes/fc-room.png',
  kicker: 'FAMICOM CARTRIDGE WALL',
  titleLines: ['选出你最喜欢的', '九款红白机游戏'],
  accentLine: 1,
  description: '把最想重新插上卡带的九款游戏留在这里。',
  startLabel: '开始选择',
  signatureLabel: '卡带墙署名',
  signaturePlaceholder: '比如：阿杰',
  previewSignature: '阿杰',
  itemLabel: '红白机游戏',
  pickerTitle: '选择一款红白机游戏',
  quickFilters: ['动作', '射击', '角色扮演', '益智'],
  shareTitle: (signature) => `${signature}的FC卡带墙`,
  shareCaption: '热血的记忆，永远插在心里。',
  titleSuffix: '最喜欢的九款红白机游戏',
  posterBrand: 'FAMICOM CARTRIDGE WALL',
  posterSiteLabel: '偏爱 · FC经典游戏',
  posterTheme: 'fc',
  downloadName: 'fc-classic-games.png',
};

export function FcExperience() {
  return <CollectionExperience config={config} />;
}
