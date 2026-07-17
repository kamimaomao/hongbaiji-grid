import { mkdir, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const catalogs = {
  movie: [
    ['inception', '盗梦空间', 'Inception', 2010, '华纳兄弟', '科幻', ['盗梦空间电影']],
    ['interstellar', '星际穿越', 'Interstellar', 2014, '派拉蒙', '科幻', ['星际效应']],
    ['shawshank', '肖申克的救赎', 'The Shawshank Redemption', 1994, '哥伦比亚影业', '剧情', ['刺激1995']],
    ['forrest-gump', '阿甘正传', 'Forrest Gump', 1994, '派拉蒙', '剧情', ['阿甘']],
    ['godfather', '教父', 'The Godfather', 1972, '派拉蒙', '犯罪', ['教父1']],
    ['pulp-fiction', '低俗小说', 'Pulp Fiction', 1994, '米拉麦克斯', '犯罪', ['黑色追缉令']],
    ['spirited-away', '千与千寻', 'Spirited Away', 2001, '吉卜力工作室', '动画', ['神隐少女']],
    ['farewell-concubine', '霸王别姬', 'Farewell My Concubine', 1993, '汤臣电影', '剧情', ['霸王别姬电影']],
    ['infernal-affairs', '无间道', 'Infernal Affairs', 2002, '寰亚电影', '犯罪', ['无间道1']],
    ['chungking-express', '重庆森林', 'Chungking Express', 1994, '泽东电影', '爱情', ['重庆森林电影']],
    ['yi-yi', '一一', 'Yi Yi', 2000, '原子映象', '剧情', ['一一电影']],
    ['brighter-summer-day', '牯岭街少年杀人事件', 'A Brighter Summer Day', 1991, '杨德昌电影', '剧情', ['牯岭街']],
    ['parasite', '寄生虫', 'Parasite', 2019, 'CJ娱乐', '剧情', ['寄生上流']],
    ['matrix', '黑客帝国', 'The Matrix', 1999, '华纳兄弟', '科幻', ['骇客任务']],
    ['alien', '异形', 'Alien', 1979, '二十世纪福克斯', '科幻', ['异形1']],
    ['blade-runner-2049', '银翼杀手2049', 'Blade Runner 2049', 2017, '华纳兄弟', '科幻', ['银翼杀手续集']],
    ['mad-max-fury-road', '疯狂的麦克斯：狂暴之路', 'Mad Max: Fury Road', 2015, '华纳兄弟', '动作', ['狂暴之路']],
    ['whiplash', '爆裂鼓手', 'Whiplash', 2014, '索尼经典', '剧情', ['鼓动真我']],
    ['la-la-land', '爱乐之城', 'La La Land', 2016, '狮门影业', '爱情', ['星声梦里人']],
    ['cinema-paradiso', '天堂电影院', 'Cinema Paradiso', 1988, '米拉麦克斯', '剧情', ['新天堂乐园']],
    ['life-is-beautiful', '美丽人生', 'Life Is Beautiful', 1997, '米拉麦克斯', '剧情', ['一个快乐的传说']],
    ['truman-show', '楚门的世界', 'The Truman Show', 1998, '派拉蒙', '剧情', ['真人世界']],
    ['coco', '寻梦环游记', 'Coco', 2017, '皮克斯', '动画', ['玩转极乐园']],
    ['dune-part-two', '沙丘2', 'Dune: Part Two', 2024, '华纳兄弟', '科幻', ['沙丘第二部']],
  ],
  classicDrama: [
    ['meteor-garden', '流星花园', 'Meteor Garden', 2001, '华视', '青春爱情', ['台湾流星花园'], 'Meteor Garden (2001 TV series)'],
    ['meteor-garden-2', '流星花园Ⅱ', 'Meteor Garden II', 2002, '华视', '青春爱情', ['流星花园2'], 'Meteor Garden II'],
    ['it-started-with-a-kiss', '恶作剧之吻', 'It Started with a Kiss', 2005, '中视', '青春爱情', ['台版恶作剧之吻'], 'It Started with a Kiss (TV series)'],
    ['they-kiss-again', '恶作剧2吻', 'They Kiss Again', 2007, '中视', '青春爱情', ['恶作剧之吻2'], 'They Kiss Again'],
    ['prince-frog', '王子变青蛙', 'The Prince Who Turns into a Frog', 2005, '台视', '偶像爱情', ['王子变青蛙电视剧'], 'The Prince Who Turns into a Frog'],
    ['fated-love', '命中注定我爱你', 'Fated to Love You', 2008, '台视', '偶像爱情', ['台版命中注定我爱你'], 'Fated to Love You (2008 TV series)'],
    ['devil-beside-you', '恶魔在身边', 'Devil Beside You', 2005, '中视', '青春爱情', ['恶魔在身边电视剧'], 'Devil Beside You'],
    ['smiling-pasta', '微笑Pasta', 'Smiling Pasta', 2006, '台视', '青春爱情', ['微笑百事达'], 'Smiling Pasta'],
    ['my-lucky-star', '放羊的星星', 'My Lucky Star', 2007, '台视', '偶像爱情', ['放羊的星星电视剧'], 'My Lucky Star (TV series)'],
    ['autumn-concerto', '下一站，幸福', "Autumn's Concerto", 2009, '台视', '偶像爱情', ['下一站幸福'], "Autumn's Concerto"],
    ['outsiders', '斗鱼', 'The Outsiders', 2004, '八大电视', '青春', ['斗鱼电视剧'], 'The Outsiders (Taiwanese TV series)'],
    ['mars', '战神', 'MARS', 2004, '华视', '青春爱情', ['台剧战神'], 'Mars (Taiwanese TV series)'],
    ['hana-kimi', '花样少年少女', 'Hana-Kimi', 2006, '华视', '青春喜剧', ['花样少男少女'], 'Hanazakarino Kimitachihe (Taiwanese TV series)'],
    ['corner-love', '转角遇到爱', 'Corner with Love', 2007, '中视', '偶像爱情', ['转角遇到爱电视剧'], 'Corner with Love'],
    ['romantic-princess', '公主小妹', 'Romantic Princess', 2007, '中视', '偶像爱情', ['公主小妹电视剧'], 'Romantic Princess'],
    ['bull-fighting', '斗牛，要不要', 'Bull Fighting', 2007, '台视', '青春爱情', ['斗牛要不要'], 'Bull Fighting (TV series)'],
    ['black-white', '痞子英雄', 'Black & White', 2009, '公视', '动作', ['痞子英雄电视剧'], 'Black & White (TV series)'],
    ['in-time-with-you', '我可能不会爱你', 'In Time with You', 2011, '民视', '都市爱情', ['我可能不会爱你台剧'], 'In Time with You'],
    ['fierce-wife', '犀利人妻', 'The Fierce Wife', 2010, '台视', '都市爱情', ['犀利人妻电视剧'], 'The Fierce Wife'],
    ['my-queen', '败犬女王', 'My Queen', 2009, '台视', '都市爱情', ['败犬女王电视剧'], 'My Queen (TV series)'],
    ['hi-sweetheart', '海派甜心', 'Hi My Sweetheart', 2009, '华视', '偶像爱情', ['海派甜心电视剧'], 'Hi My Sweetheart'],
    ['miss-no-good', '不良笑花', 'Miss No Good', 2008, '华视', '偶像喜剧', ['不良笑花电视剧'], 'Miss No Good'],
    ['love-contract', '爱情合约', 'Love Contract', 2004, 'TVBS-G', '青春爱情', ['爱情合约电视剧'], 'Love Contract'],
    ['why-why-love', '换换爱', 'Why Why Love', 2007, '华视', '偶像爱情', ['换换爱电视剧'], 'Why Why Love'],
  ],
  pc: [
    ['warcraft-3', '魔兽争霸Ⅲ', 'Warcraft III: Reign of Chaos', 2002, '暴雪娱乐', '即时战略', ['魔兽争霸3']],
    ['starcraft', '星际争霸', 'StarCraft', 1998, '暴雪娱乐', '即时战略', ['星际1']],
    ['diablo-2', '暗黑破坏神Ⅱ', 'Diablo II', 2000, '暴雪娱乐', '动作角色扮演', ['暗黑2']],
    ['age-of-empires-2', '帝国时代Ⅱ', 'Age of Empires II', 1999, '微软游戏工作室', '即时战略', ['帝国时代2']],
    ['counter-strike', '反恐精英', 'Counter-Strike', 2000, 'Valve', '射击', ['CS', 'CS1.6']],
    ['half-life-2', '半衰期2', 'Half-Life 2', 2004, 'Valve', '射击', ['半条命2']],
    ['the-sims', '模拟人生', 'The Sims', 2000, '艺电', '模拟', ['模拟市民']],
    ['simcity-4', '模拟城市4', 'SimCity 4', 2003, '艺电', '模拟', ['模拟城市']],
    ['civilization-6', '文明Ⅵ', 'Civilization VI', 2016, '2K', '策略', ['文明6']],
    ['world-of-warcraft', '魔兽世界', 'World of Warcraft', 2004, '暴雪娱乐', '网络游戏', ['WOW']],
    ['league-of-legends', '英雄联盟', 'League of Legends', 2009, 'Riot Games', '竞技', ['LOL']],
    ['dota-2', 'Dota 2', 'Dota 2', 2013, 'Valve', '竞技', ['刀塔2']],
    ['minecraft', '我的世界', 'Minecraft', 2011, 'Mojang', '沙盒', ['Minecraft']],
    ['terraria', '泰拉瑞亚', 'Terraria', 2011, 'Re-Logic', '沙盒', ['泰拉']],
    ['stardew-valley', '星露谷物语', 'Stardew Valley', 2016, 'ConcernedApe', '模拟', ['星露谷']],
    ['portal-2', '传送门2', 'Portal 2', 2011, 'Valve', '益智', ['Portal 2']],
    ['disco-elysium', '极乐迪斯科', 'Disco Elysium', 2019, 'ZA/UM', '角色扮演', ['迪斯科极乐']],
    ['baldurs-gate-3', '博德之门3', "Baldur's Gate 3", 2023, 'Larian Studios', '角色扮演', ['博德3']],
    ['witcher-3', '巫师3：狂猎', 'The Witcher 3: Wild Hunt', 2015, 'CD Projekt', '角色扮演', ['巫师3']],
    ['cyberpunk-2077', '赛博朋克2077', 'Cyberpunk 2077', 2020, 'CD Projekt', '角色扮演', ['2077']],
    ['red-dead-2', '荒野大镖客：救赎2', 'Red Dead Redemption 2', 2018, 'Rockstar Games', '动作冒险', ['大表哥2']],
    ['elden-ring', '艾尔登法环', 'Elden Ring', 2022, 'FromSoftware', '动作角色扮演', ['老头环']],
    ['hades', '哈迪斯', 'Hades', 2020, 'Supergiant Games', '动作', ['黑帝斯']],
    ['hollow-knight', '空洞骑士', 'Hollow Knight', 2017, 'Team Cherry', '动作冒险', ['空洞']],
    ['factorio', '异星工厂', 'Factorio', 2020, 'Wube Software', '模拟', ['Factorio']],
    ['rimworld', '环世界', 'RimWorld', 2018, 'Ludeon Studios', '模拟', ['边缘世界']],
    ['cities-skylines', '城市：天际线', 'Cities: Skylines', 2015, 'Paradox Interactive', '模拟', ['都市天际线']],
    ['overwatch', '守望先锋', 'Overwatch', 2016, '暴雪娱乐', '射击', ['屁股']],
    ['genshin', '原神', 'Genshin Impact', 2020, '米哈游', '动作角色扮演', ['Genshin']],
    ['valorant', '无畏契约', 'Valorant', 2020, 'Riot Games', '射击', ['瓦罗兰特']],
  ],
  console: [
    ['last-of-us', '最后生还者', 'The Last of Us', 2013, 'Naughty Dog', '动作冒险', ['美国末日']],
    ['god-of-war-ragnarok', '战神：诸神黄昏', 'God of War Ragnarök', 2022, 'Santa Monica Studio', '动作冒险', ['战神5']],
    ['bloodborne', '血源诅咒', 'Bloodborne', 2015, 'FromSoftware', '动作角色扮演', ['血源']],
    ['ghost-of-tsushima', '对马岛之魂', 'Ghost of Tsushima', 2020, 'Sucker Punch', '动作冒险', ['对马岛']],
    ['uncharted-4', '神秘海域4', "Uncharted 4: A Thief's End", 2016, 'Naughty Dog', '动作冒险', ['神海4']],
    ['gran-turismo-7', '跑车浪漫旅7', 'Gran Turismo 7', 2022, 'Polyphony Digital', '竞速', ['GT7']],
    ['forza-horizon-5', '极限竞速：地平线5', 'Forza Horizon 5', 2021, 'Playground Games', '竞速', ['地平线5']],
    ['halo-3', '光环3', 'Halo 3', 2007, 'Bungie', '射击', ['光晕3']],
    ['gears-of-war', '战争机器', 'Gears of War', 2006, 'Epic Games', '射击', ['战争机器1']],
    ['zelda-botw', '塞尔达传说：旷野之息', 'The Legend of Zelda: Breath of the Wild', 2017, 'Nintendo', '动作冒险', ['野炊']],
    ['mario-odyssey', '超级马力欧：奥德赛', 'Super Mario Odyssey', 2017, 'Nintendo', '平台动作', ['马里奥奥德赛']],
    ['animal-crossing', '集合啦！动物森友会', 'Animal Crossing: New Horizons', 2020, 'Nintendo', '模拟', ['动森']],
    ['splatoon-3', '斯普拉遁3', 'Splatoon 3', 2022, 'Nintendo', '射击', ['喷射战士3']],
    ['metroid-prime', '银河战士Prime', 'Metroid Prime', 2002, 'Retro Studios', '动作冒险', ['密特罗德Prime']],
    ['persona-5', '女神异闻录5', 'Persona 5', 2016, 'Atlus', '角色扮演', ['P5']],
    ['ff7-remake', '最终幻想VII 重制版', 'Final Fantasy VII Remake', 2020, 'Square Enix', '角色扮演', ['FF7RE']],
    ['monster-hunter-world', '怪物猎人：世界', 'Monster Hunter: World', 2018, 'Capcom', '动作角色扮演', ['怪猎世界']],
    ['shadow-colossus', '旺达与巨像', 'Shadow of the Colossus', 2005, 'Team Ico', '动作冒险', ['汪达与巨像']],
    ['journey', '风之旅人', 'Journey', 2012, 'Thatgamecompany', '冒险', ['旅途']],
    ['littlebigplanet', '小小大星球', 'LittleBigPlanet', 2008, 'Media Molecule', '平台动作', ['LBP']],
    ['metal-gear-solid-3', '潜龙谍影3', 'Metal Gear Solid 3: Snake Eater', 2004, 'Konami', '潜入动作', ['合金装备3']],
    ['resident-evil-4', '生化危机4', 'Resident Evil 4', 2005, 'Capcom', '动作冒险', ['恶灵古堡4']],
    ['street-fighter-6', '街头霸王6', 'Street Fighter 6', 2023, 'Capcom', '格斗', ['街霸6']],
    ['tekken-8', '铁拳8', 'Tekken 8', 2024, 'Bandai Namco', '格斗', ['铁拳八']],
    ['it-takes-two', '双人成行', 'It Takes Two', 2021, 'Hazelight Studios', '合作冒险', ['双人同行']],
    ['sekiro', '只狼：影逝二度', 'Sekiro: Shadows Die Twice', 2019, 'FromSoftware', '动作冒险', ['只狼']],
    ['bayonetta-2', '猎天使魔女2', 'Bayonetta 2', 2014, 'PlatinumGames', '动作', ['贝优妮塔2']],
    ['fire-emblem-three-houses', '火焰纹章：风花雪月', 'Fire Emblem: Three Houses', 2019, 'Intelligent Systems', '策略角色扮演', ['风花雪月']],
    ['mario-kart-8', '马力欧卡丁车8 豪华版', 'Mario Kart 8', 2014, 'Nintendo', '竞速', ['马车8']],
    ['pokemon-arceus', '宝可梦传说 阿尔宙斯', 'Pokémon Legends: Arceus', 2022, 'Game Freak', '角色扮演', ['阿尔宙斯']],
  ],
  boardgame: [
    ['catan', '卡坦岛', 'Catan', 1995, 'Kosmos', '策略', ['卡坦']],
    ['carcassonne', '卡卡颂', 'Carcassonne', 2000, 'Hans im Glück', '版图', ['卡卡城']],
    ['ticket-to-ride', '铁路环游', 'Ticket to Ride', 2004, 'Days of Wonder', '家庭', ['车票之旅']],
    ['pandemic', '瘟疫危机', 'Pandemic', 2008, 'Z-Man Games', '合作', ['禁制之岛团队']],
    ['seven-wonders', '七大奇迹', '7 Wonders', 2010, 'Repos Production', '卡牌', ['7大奇迹']],
    ['agricola', '农场主', 'Agricola', 2007, 'Lookout Games', '策略', ['农家乐']],
    ['puerto-rico', '波多黎各', 'Puerto Rico', 2002, 'Alea', '策略', ['波多黎各桌游']],
    ['dominion', '皇舆争霸', 'Dominion', 2008, 'Rio Grande Games', '牌库构筑', ['领土']],
    ['codenames', '行动代号', 'Codenames', 2015, 'Czech Games Edition', '聚会', ['机密代号']],
    ['azul', '花砖物语', 'Azul', 2017, 'Next Move Games', '抽象策略', ['蓝瓷']],
    ['wingspan', '展翅翱翔', 'Wingspan', 2019, 'Stonemaier Games', '策略', ['翼展']],
    ['scythe', '镰刀战争', 'Scythe', 2016, 'Stonemaier Games', '策略', ['镰刀']],
    ['terraforming-mars', '殖民火星', 'Terraforming Mars', 2016, 'FryxGames', '策略', ['重塑火星']],
    ['gloomhaven', '幽港迷城', 'Gloomhaven', 2017, 'Cephalofair Games', '合作', ['阴森港']],
    ['root', '茂林源记', 'Root', 2018, 'Leder Games', '策略', ['根源']],
    ['everdell', '仙境幽谷', 'Everdell', 2018, 'Starling Games', '工人放置', ['永恒之谷']],
    ['brass-birmingham', '工业革命：伯明翰', 'Brass: Birmingham', 2018, 'Roxley', '经济策略', ['黄铜伯明翰']],
    ['ark-nova', '方舟动物园', 'Ark Nova', 2021, 'Feuerland Spiele', '策略', ['新方舟']],
    ['spirit-island', '灵迹岛', 'Spirit Island', 2017, 'Greater Than Games', '合作', ['精灵岛']],
    ['the-crew', '星际探险队', 'The Crew: The Quest for Planet Nine', 2019, 'Kosmos', '合作', ['The Crew']],
    ['dixit', '妙语说书人', 'Dixit', 2008, 'Libellud', '聚会', ['只言片语']],
    ['splendor', '璀璨宝石', 'Splendor', 2014, 'Space Cowboys', '家庭', ['宝石商人']],
    ['patchwork', '拼布艺术', 'Patchwork', 2014, 'Lookout Games', '双人', ['拼布']],
    ['cascadia', '卡斯卡迪亚之旅', 'Cascadia', 2021, 'Flatout Games', '版图', ['卡斯卡迪亚']],
    ['heat', '极速狂飙', 'Heat: Pedal to the Metal', 2022, 'Days of Wonder', '竞速', ['Heat桌游']],
    ['dune-imperium', '沙丘：帝国', 'Dune: Imperium', 2020, 'Dire Wolf', '牌库构筑', ['沙丘帝国桌游']],
    ['lost-ruins-arnak', '阿纳克遗迹', 'Lost Ruins of Arnak', 2020, 'Czech Games Edition', '策略', ['失落的阿纳克']],
    ['tapestry', '文明绘卷', 'Tapestry', 2019, 'Stonemaier Games', '策略', ['织锦']],
    ['mysterium', '诡秘庄园', 'Mysterium', 2015, 'Libellud', '合作', ['神秘大地庄园']],
    ['pandemic-legacy', '瘟疫危机：传承', 'Pandemic Legacy: Season 1', 2015, 'Z-Man Games', '合作', ['瘟疫传承']],
  ],
};

const pageOverrides = {
  movie: {
    shawshank: 'The Shawshank Redemption',
    'farewell-concubine': 'Farewell My Concubine (film)',
    'infernal-affairs': 'Infernal Affairs',
    'chungking-express': 'Chungking Express',
    'yi-yi': 'Yi Yi',
    'brighter-summer-day': 'A Brighter Summer Day',
    parasite: 'Parasite (2019 film)',
    matrix: 'The Matrix',
    alien: 'Alien (film)',
    'life-is-beautiful': 'Life Is Beautiful',
    coco: 'Coco (2017 film)',
  },
  pc: {
    'warcraft-3': 'Warcraft III: Reign of Chaos',
    'diablo-2': 'Diablo II',
    'age-of-empires-2': 'Age of Empires II',
    'the-sims': 'The Sims (video game)',
    'civilization-6': 'Civilization VI',
    'dota-2': 'Dota 2',
    minecraft: 'Minecraft',
    'baldurs-gate-3': "Baldur's Gate 3",
    'witcher-3': 'The Witcher 3: Wild Hunt',
    'red-dead-2': 'Red Dead Redemption 2',
    genshin: 'Genshin Impact',
  },
  console: {
    'last-of-us': 'The Last of Us',
    'god-of-war-ragnarok': 'God of War Ragnarök',
    'halo-3': 'Halo 3',
    'gears-of-war': 'Gears of War (video game)',
    'zelda-botw': 'The Legend of Zelda: Breath of the Wild',
    'animal-crossing': 'Animal Crossing: New Horizons',
    'persona-5': 'Persona 5',
    'shadow-colossus': 'Shadow of the Colossus',
    journey: 'Journey (2012 video game)',
    littlebigplanet: 'LittleBigPlanet',
    'resident-evil-4': 'Resident Evil 4',
    'it-takes-two': 'It Takes Two (video game)',
    sekiro: 'Sekiro: Shadows Die Twice',
    'pokemon-arceus': 'Pokémon Legends: Arceus',
  },
  boardgame: {
    catan: 'Catan',
    carcassonne: 'Carcassonne (board game)',
    pandemic: 'Pandemic (board game)',
    'seven-wonders': '7 Wonders (board game)',
    agricola: 'Agricola (board game)',
    dominion: 'Dominion (card game)',
    codenames: 'Codenames (board game)',
    azul: 'Azul (board game)',
    wingspan: 'Wingspan (board game)',
    scythe: 'Scythe (board game)',
    root: 'Root (board game)',
    everdell: 'Everdell',
    tapestry: 'Tapestry (board game)',
    mysterium: 'Mysterium (board game)',
  },
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const getPageTitle = (category, row) => row[7] ?? pageOverrides[category]?.[row[0]] ?? row[2];

const getSummary = async (title) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { stdout } = await execFileAsync('curl', ['-sS', '-L', '--max-time', '30', url], { maxBuffer: 4 * 1024 * 1024 });
    try {
      return JSON.parse(stdout);
    } catch {
      if (attempt === 4) throw new Error(stdout.slice(0, 80));
      await sleep(1200 * (attempt + 1));
    }
  }
  return null;
};

const downloadImage = async (url, outputBase) => {
  const sourceExtension = path.extname(new URL(url).pathname).toLowerCase();
  const extension = sourceExtension === '.png' ? 'png' : sourceExtension === '.webp' ? 'webp' : 'jpg';
  const output = `${outputBase}.${extension}`;
  await execFileAsync('curl', ['-sS', '-L', '--max-time', '45', '-o', output, url]);
  return extension;
};

const result = {};

for (const [category, rows] of Object.entries(catalogs)) {
  const outputDir = path.resolve('public', 'covers', category === 'classicDrama' ? 'classic-drama' : category);
  await mkdir(outputDir, { recursive: true });
  result[category] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const [id, titleZh, titleOriginal, year, publisher, genre, aliases] = row;
    const pageTitle = getPageTitle(category, row);

    try {
      const summary = await getSummary(pageTitle);
      const imageUrl = summary?.originalimage?.source ?? summary?.thumbnail?.source;
      if (!imageUrl) throw new Error('no image');
      const extension = await downloadImage(imageUrl, path.join(outputDir, id));
      result[category].push({
        id: `${category}-${id}`,
        titleZh,
        titleOriginal,
        aliases,
        year,
        publisher,
        genre,
        popularity: 2000 - index * 10,
        imagePath: `covers/${category === 'classicDrama' ? 'classic-drama' : category}/${id}.${extension}`,
        sourceUrl: summary.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
      });
      process.stdout.write(`✓ ${category}/${id}\n`);
    } catch (error) {
      process.stderr.write(`✗ ${category}/${id}: ${error.message}\n`);
    }

    await sleep(350);
  }
}

await mkdir(path.resolve('src', 'data', 'generated'), { recursive: true });
await writeFile(path.resolve('src', 'data', 'generated', 'extended-catalogs.json'), `${JSON.stringify(result, null, 2)}\n`);

for (const [category, items] of Object.entries(result)) {
  process.stdout.write(`${category}: ${items.length}\n`);
}
