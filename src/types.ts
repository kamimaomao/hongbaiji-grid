export type GameGenre =
  | '动作'
  | '冒险'
  | '射击'
  | '角色扮演'
  | '益智'
  | '体育'
  | '竞速'
  | '格斗'
  | '策略';

export interface FcGame {
  id: string;
  titleZh: string;
  titleOriginal: string;
  aliases: string[];
  year: number;
  publisher: string;
  genre: GameGenre;
  popularity: number;
  imageUrl: string;
}

export interface SelectedGameSnapshot {
  id: string;
  titleZh: string;
  titleOriginal: string;
  year: number;
  publisher: string;
  imageUrl: string;
}

export type GridSelection = Array<SelectedGameSnapshot | null>;
