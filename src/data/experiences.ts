import type { CatalogItem } from '../types';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const musicAlbums: CatalogItem[] = [
  { id: 'album-jay', titleZh: 'Jay', titleOriginal: 'Jay', aliases: ['周杰伦同名专辑', '周杰伦'], year: 2000, publisher: '周杰伦', genre: '华语', popularity: 1200, imageUrl: asset('covers/music/jay.jpg') },
  { id: 'album-back-to-black', titleZh: 'Back to Black', titleOriginal: 'Back to Black', aliases: ['Amy Winehouse', '艾米怀恩豪斯'], year: 2006, publisher: 'Amy Winehouse', genre: '灵魂乐', popularity: 1190, imageUrl: asset('covers/music/back-to-black.jpg') },
  { id: 'album-abbey-road', titleZh: 'Abbey Road', titleOriginal: 'Abbey Road', aliases: ['The Beatles', '披头士'], year: 1969, publisher: 'The Beatles', genre: '摇滚', popularity: 1180, imageUrl: asset('covers/music/abbey-road.jpg') },
  { id: 'album-21', titleZh: '21', titleOriginal: '21', aliases: ['Adele', '阿黛尔'], year: 2011, publisher: 'Adele', genre: '流行', popularity: 1170, imageUrl: asset('covers/music/21.jpg') },
  { id: 'album-damn', titleZh: 'DAMN.', titleOriginal: 'DAMN.', aliases: ['Kendrick Lamar', '肯德里克拉马尔'], year: 2017, publisher: 'Kendrick Lamar', genre: '嘻哈', popularity: 1160, imageUrl: asset('covers/music/damn.jpg') },
  { id: 'album-the-wall', titleZh: 'The Wall', titleOriginal: 'The Wall', aliases: ['Pink Floyd', '迷墙'], year: 1979, publisher: 'Pink Floyd', genre: '摇滚', popularity: 1150, imageUrl: asset('covers/music/the-wall.jpg') },
  { id: 'album-rumours', titleZh: 'Rumours', titleOriginal: 'Rumours', aliases: ['Fleetwood Mac', '弗利特伍德麦克'], year: 1977, publisher: 'Fleetwood Mac', genre: '摇滚', popularity: 1140, imageUrl: asset('covers/music/rumours.jpg') },
  { id: 'album-kind-of-blue', titleZh: 'Kind of Blue', titleOriginal: 'Kind of Blue', aliases: ['Miles Davis', '迈尔斯戴维斯'], year: 1959, publisher: 'Miles Davis', genre: '爵士', popularity: 1130, imageUrl: asset('covers/music/kind-of-blue.jpg') },
  { id: 'album-ram', titleZh: 'Random Access Memories', titleOriginal: 'Random Access Memories', aliases: ['Daft Punk', '蠢朋克'], year: 2013, publisher: 'Daft Punk', genre: '电子', popularity: 1120, imageUrl: asset('covers/music/random-access-memories.jpg') },
  { id: 'album-in-rainbows', titleZh: 'In Rainbows', titleOriginal: 'In Rainbows', aliases: ['Radiohead', '电台司令'], year: 2007, publisher: 'Radiohead', genre: '独立', popularity: 1110, imageUrl: asset('covers/music/in-rainbows.jpg') },
  { id: 'album-melodrama', titleZh: 'Melodrama', titleOriginal: 'Melodrama', aliases: ['Lorde', '洛德'], year: 2017, publisher: 'Lorde', genre: '流行', popularity: 1100, imageUrl: asset('covers/music/melodrama.jpg') },
  { id: 'album-tpab', titleZh: 'To Pimp a Butterfly', titleOriginal: 'To Pimp a Butterfly', aliases: ['Kendrick Lamar'], year: 2015, publisher: 'Kendrick Lamar', genre: '嘻哈', popularity: 1090, imageUrl: asset('covers/music/to-pimp-a-butterfly.jpg') },
];

export const dramaShows: CatalogItem[] = [
  { id: 'drama-first-frost', titleZh: '难哄', titleOriginal: 'The First Frost', aliases: ['难哄电视剧'], year: 2025, publisher: '优酷', genre: '都市爱情', popularity: 1200, imageUrl: asset('covers/drama/first-frost.jpg') },
  { id: 'drama-flourished-peony', titleZh: '国色芳华', titleOriginal: 'Flourished Peony', aliases: ['国色芳华电视剧'], year: 2025, publisher: '芒果TV', genre: '古装', popularity: 1190, imageUrl: asset('covers/drama/flourished-peony.jpg') },
  { id: 'drama-playing-go', titleZh: '棋士', titleOriginal: 'Playing Go', aliases: ['棋士电视剧'], year: 2025, publisher: '腾讯视频', genre: '悬疑', popularity: 1180, imageUrl: asset('covers/drama/playing-go.jpg') },
  { id: 'drama-the-double', titleZh: '墨雨云间', titleOriginal: 'The Double', aliases: ['墨雨云间电视剧'], year: 2024, publisher: '优酷', genre: '古装', popularity: 1170, imageUrl: asset('covers/drama/the-double.jpg') },
  { id: 'drama-when-i-fly', titleZh: '当我飞奔向你', titleOriginal: 'When I Fly Towards You', aliases: ['当我飞奔向你电视剧'], year: 2023, publisher: '优酷', genre: '青春', popularity: 1160, imageUrl: asset('covers/drama/when-i-fly.jpg') },
  { id: 'drama-lost-you-forever', titleZh: '长相思', titleOriginal: 'Lost You Forever', aliases: ['长相思电视剧'], year: 2023, publisher: '腾讯视频', genre: '古装', popularity: 1150, imageUrl: asset('covers/drama/lost-you-forever.jpg') },
  { id: 'drama-bad-kids', titleZh: '隐秘的角落', titleOriginal: 'The Bad Kids', aliases: ['隐秘的角落电视剧'], year: 2020, publisher: '爱奇艺', genre: '悬疑', popularity: 1140, imageUrl: asset('covers/drama/bad-kids.jpg') },
  { id: 'drama-long-season', titleZh: '漫长的季节', titleOriginal: 'The Long Season', aliases: ['漫长的季节电视剧'], year: 2023, publisher: '腾讯视频', genre: '悬疑', popularity: 1130, imageUrl: asset('covers/drama/long-season.jpg') },
  { id: 'drama-hidden-love', titleZh: '偷偷藏不住', titleOriginal: 'Hidden Love', aliases: ['偷偷藏不住电视剧'], year: 2023, publisher: '优酷', genre: '都市爱情', popularity: 1120, imageUrl: asset('covers/drama/hidden-love.jpg') },
  { id: 'drama-reset', titleZh: '开端', titleOriginal: 'Reset', aliases: ['开端电视剧'], year: 2022, publisher: '腾讯视频', genre: '悬疑', popularity: 1110, imageUrl: asset('covers/drama/reset.jpg') },
  { id: 'drama-meet-yourself', titleZh: '去有风的地方', titleOriginal: 'Meet Yourself', aliases: ['去有风的地方电视剧'], year: 2023, publisher: '芒果TV', genre: '治愈', popularity: 1100, imageUrl: asset('covers/drama/meet-yourself.jpg') },
  { id: 'drama-blossoms', titleZh: '繁花', titleOriginal: 'Blossoms Shanghai', aliases: ['繁花电视剧'], year: 2023, publisher: '腾讯视频', genre: '年代', popularity: 1090, imageUrl: asset('covers/drama/blossoms.jpg') },
];

export const duelAnime: CatalogItem[] = [
  { id: 'duel-fullmetal', titleZh: '钢之炼金术师FA', titleOriginal: 'Fullmetal Alchemist: Brotherhood', aliases: ['钢炼FA'], year: 2009, publisher: 'bones', genre: '动作', popularity: 1200, imageUrl: asset('covers/anime-duel/fullmetal.jpg') },
  { id: 'duel-aot', titleZh: '进击的巨人', titleOriginal: 'Attack on Titan', aliases: ['巨人'], year: 2013, publisher: 'WIT STUDIO', genre: '动作', popularity: 1190, imageUrl: asset('covers/anime-duel/attack-on-titan.jpg') },
  { id: 'duel-death-note', titleZh: '死亡笔记', titleOriginal: 'Death Note', aliases: [], year: 2006, publisher: 'MADHOUSE', genre: '悬疑', popularity: 1180, imageUrl: asset('covers/anime-duel/death-note.jpg') },
  { id: 'duel-demon-slayer', titleZh: '鬼灭之刃', titleOriginal: 'Demon Slayer', aliases: [], year: 2019, publisher: 'ufotable', genre: '动作', popularity: 1170, imageUrl: asset('covers/anime-duel/demon-slayer.jpg') },
  { id: 'duel-one-piece', titleZh: '海贼王', titleOriginal: 'ONE PIECE', aliases: ['航海王'], year: 1999, publisher: 'Toei Animation', genre: '冒险', popularity: 1160, imageUrl: asset('covers/anime-duel/one-piece.jpg') },
  { id: 'duel-naruto', titleZh: '火影忍者', titleOriginal: 'Naruto', aliases: [], year: 2002, publisher: 'Studio Pierrot', genre: '动作', popularity: 1150, imageUrl: asset('covers/anime-duel/naruto.jpg') },
  { id: 'duel-your-name', titleZh: '你的名字', titleOriginal: 'Your Name.', aliases: [], year: 2016, publisher: 'CoMix Wave', genre: '剧情', popularity: 1140, imageUrl: asset('covers/anime-duel/your-name.png') },
  { id: 'duel-hxh', titleZh: '全职猎人', titleOriginal: 'Hunter x Hunter', aliases: [], year: 2011, publisher: 'MADHOUSE', genre: '冒险', popularity: 1130, imageUrl: asset('covers/anime-duel/hunter-x-hunter.png') },
  { id: 'duel-opm', titleZh: '一拳超人', titleOriginal: 'One-Punch Man', aliases: [], year: 2015, publisher: 'MADHOUSE', genre: '动作', popularity: 1120, imageUrl: asset('covers/anime-duel/one-punch-man.jpg') },
  { id: 'duel-jjk', titleZh: '咒术回战', titleOriginal: 'JUJUTSU KAISEN', aliases: [], year: 2020, publisher: 'MAPPA', genre: '动作', popularity: 1110, imageUrl: asset('covers/anime-duel/jujutsu-kaisen.jpg') },
  { id: 'duel-silent-voice', titleZh: '声之形', titleOriginal: 'A Silent Voice', aliases: [], year: 2016, publisher: 'Kyoto Animation', genre: '剧情', popularity: 1100, imageUrl: asset('covers/anime-duel/silent-voice.jpg') },
  { id: 'duel-steins-gate', titleZh: '命运石之门', titleOriginal: 'Steins;Gate', aliases: [], year: 2011, publisher: 'WHITE FOX', genre: '科幻', popularity: 1090, imageUrl: asset('covers/anime-duel/steins-gate.jpg') },
  { id: 'duel-haikyu', titleZh: '排球少年！！', titleOriginal: 'HAIKYU!!', aliases: [], year: 2014, publisher: 'Production I.G', genre: '运动', popularity: 1080, imageUrl: asset('covers/anime-duel/haikyu.png') },
  { id: 'duel-bocchi', titleZh: '孤独摇滚', titleOriginal: 'BOCCHI THE ROCK!', aliases: [], year: 2022, publisher: 'CloverWorks', genre: '喜剧', popularity: 1070, imageUrl: asset('covers/anime-duel/bocchi.png') },
  { id: 'duel-dbz', titleZh: '龙珠Z', titleOriginal: 'Dragon Ball Z', aliases: [], year: 1989, publisher: 'Toei Animation', genre: '动作', popularity: 1060, imageUrl: asset('covers/anime-duel/dragon-ball-z.png') },
  { id: 'duel-spy-family', titleZh: '间谍过家家', titleOriginal: 'SPY x FAMILY', aliases: [], year: 2022, publisher: 'CloverWorks', genre: '喜剧', popularity: 1050, imageUrl: asset('covers/anime-duel/spy-family.jpg') },
];
