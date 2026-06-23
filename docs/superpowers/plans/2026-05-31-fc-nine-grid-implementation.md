# FC Nine Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first FC 游戏九宫格 web app where a Chinese user enters an optional signature, selects 9 FC games from an internal catalog, and downloads a shareable image.

**Architecture:** Start from an empty Vite + React + TypeScript app. Keep domain logic in small pure modules (`search`, `selection`, `poster`) with Vitest coverage, and keep React components thin. Use an internal static FC game catalog for MVP; generated images are rendered client-side with Canvas.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, CSS, browser Canvas API.

---

## File Structure

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite document shell.
- `vite.config.ts`: Vite and Vitest config.
- `tsconfig.json`: TypeScript config for browser app.
- `src/test/setup.ts`: Vitest DOM matcher setup.
- `src/main.tsx`: React entry point.
- `src/App.tsx`: App state orchestration.
- `src/App.test.tsx`: Primary interaction tests.
- `src/styles.css`: Mobile-first page and component styling.
- `src/types.ts`: Shared domain types.
- `src/data/fcGames.ts`: Internal FC game catalog.
- `src/data/fcGames.test.ts`: Catalog validation tests.
- `src/lib/search.ts`: Query, filter, and sort utilities.
- `src/lib/search.test.ts`: Search/filter/sort tests.
- `src/lib/selection.ts`: Signature and 9-slot selection helpers.
- `src/lib/selection.test.ts`: Selection helper tests.
- `src/lib/poster.ts`: Canvas image generation.
- `src/lib/poster.test.ts`: Poster title and canvas behavior tests.
- `src/components/Grid.tsx`: 3x3 selected game grid.
- `src/components/GamePicker.tsx`: Modal/list picker with search and filters.
- `src/components/SignatureInput.tsx`: Lightweight signature field.
- `src/components/GeneratePanel.tsx`: Generate/download controls.

## Task 1: Scaffold the App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/test/setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create package and config files**

Create `package.json`:

```json
{
  "name": "fc-nine-grid",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.6.0",
    "jsdom": "^26.0.0",
    "vitest": "^3.0.0"
  }
}
```

Create `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FC 九宫格</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Add minimal React entry**

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <p className="eyebrow">FC 九宫格</p>
      <h1>选出你的 9 个童年神作</h1>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #241f1a;
  background: #f4efe5;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  width: min(100%, 720px);
  margin: 0 auto;
  padding: 24px 16px 40px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #8b5742;
  font-size: 13px;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.08;
}
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 4: Verify scaffold builds**

Run: `npm run build`

Expected: TypeScript succeeds and Vite emits `dist/`.

- [ ] **Step 5: Commit scaffold**

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json src/test/setup.ts src/main.tsx src/App.tsx src/styles.css
git commit -m "chore: scaffold FC nine grid app"
```

## Task 2: Add Domain Types and FC Game Catalog

**Files:**
- Create: `src/types.ts`
- Create: `src/data/fcGames.ts`
- Create: `src/data/fcGames.test.ts`

- [ ] **Step 1: Write catalog validation tests**

Create `src/data/fcGames.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fcGames } from './fcGames';

describe('fcGames catalog', () => {
  it('contains enough games for the first playable picker', () => {
    expect(fcGames.length).toBeGreaterThanOrEqual(24);
  });

  it('has stable unique ids', () => {
    const ids = fcGames.map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has the fields needed by search and poster generation', () => {
    for (const game of fcGames) {
      expect(game.id).toMatch(/^[a-z0-9-]+$/);
      expect(game.titleZh.length).toBeGreaterThan(0);
      expect(game.titleOriginal.length).toBeGreaterThan(0);
      expect(game.year).toBeGreaterThanOrEqual(1983);
      expect(game.year).toBeLessThanOrEqual(1994);
      expect(game.publisher.length).toBeGreaterThan(0);
      expect(game.genre.length).toBeGreaterThan(0);
      expect(game.imageUrl.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/fcGames.test.ts`

Expected: FAIL because `src/data/fcGames.ts` does not exist yet.

- [ ] **Step 3: Add types and starter FC catalog**

Create `src/types.ts`:

```ts
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
```

Create `src/data/fcGames.ts`:

```ts
import type { FcGame } from '../types';

const image = (slug: string) =>
  `https://placehold.co/360x360/241f1a/f8f0df/png?text=${encodeURIComponent(slug)}`;

export const fcGames: FcGame[] = [
  { id: 'super-mario-bros', titleZh: '超级马里奥兄弟', titleOriginal: 'Super Mario Bros.', aliases: ['超级玛丽', '水管工', '马里奥'], year: 1985, publisher: 'Nintendo', genre: '动作', popularity: 100, imageUrl: image('SUPER MARIO') },
  { id: 'contra', titleZh: '魂斗罗', titleOriginal: 'Contra', aliases: ['魂斗罗1', '魂斗罗一代'], year: 1988, publisher: 'Konami', genre: '射击', popularity: 99, imageUrl: image('CONTRA') },
  { id: 'tank-1990', titleZh: '坦克大战', titleOriginal: 'Battle City', aliases: ['坦克1990', '打坦克'], year: 1985, publisher: 'Namco', genre: '射击', popularity: 98, imageUrl: image('TANK') },
  { id: 'adventure-island', titleZh: '冒险岛', titleOriginal: "Hudson's Adventure Island", aliases: ['高桥名人冒险岛'], year: 1986, publisher: 'Hudson Soft', genre: '动作', popularity: 97, imageUrl: image('ADVENTURE') },
  { id: 'double-dragon', titleZh: '双截龙', titleOriginal: 'Double Dragon', aliases: ['双截龙1'], year: 1988, publisher: 'Technos Japan', genre: '格斗', popularity: 96, imageUrl: image('DRAGON') },
  { id: 'rockman-2', titleZh: '洛克人2', titleOriginal: 'Mega Man 2', aliases: ['Rockman 2', 'Mega Man 2'], year: 1988, publisher: 'Capcom', genre: '动作', popularity: 95, imageUrl: image('ROCKMAN 2') },
  { id: 'the-legend-of-zelda', titleZh: '塞尔达传说', titleOriginal: 'The Legend of Zelda', aliases: ['Zelda', '海拉鲁'], year: 1986, publisher: 'Nintendo', genre: '冒险', popularity: 94, imageUrl: image('ZELDA') },
  { id: 'dragon-quest-iii', titleZh: '勇者斗恶龙3', titleOriginal: 'Dragon Quest III', aliases: ['DQ3', '勇斗3'], year: 1988, publisher: 'Enix', genre: '角色扮演', popularity: 93, imageUrl: image('DQ III') },
  { id: 'final-fantasy-iii', titleZh: '最终幻想3', titleOriginal: 'Final Fantasy III', aliases: ['FF3', '太空战士3'], year: 1990, publisher: 'Square', genre: '角色扮演', popularity: 92, imageUrl: image('FF III') },
  { id: 'ninja-gaiden', titleZh: '忍者龙剑传', titleOriginal: 'Ninja Gaiden', aliases: ['忍龙', '忍者外传'], year: 1988, publisher: 'Tecmo', genre: '动作', popularity: 91, imageUrl: image('NINJA') },
  { id: 'gradius', titleZh: '宇宙巡航机', titleOriginal: 'Gradius', aliases: ['沙罗曼蛇前作'], year: 1986, publisher: 'Konami', genre: '射击', popularity: 90, imageUrl: image('GRADIUS') },
  { id: 'tetris', titleZh: '俄罗斯方块', titleOriginal: 'Tetris', aliases: ['方块'], year: 1988, publisher: 'Bullet-Proof Software', genre: '益智', popularity: 89, imageUrl: image('TETRIS') },
  { id: 'kunio-kun-dodgeball', titleZh: '热血高校躲避球', titleOriginal: 'Nekketsu Koukou Dodgeball Bu', aliases: ['热血躲避球', '国夫君躲避球'], year: 1988, publisher: 'Technos Japan', genre: '体育', popularity: 88, imageUrl: image('DODGEBALL') },
  { id: 'river-city-ransom', titleZh: '热血物语', titleOriginal: 'Downtown Nekketsu Monogatari', aliases: ['热血硬派', '国夫君'], year: 1989, publisher: 'Technos Japan', genre: '动作', popularity: 87, imageUrl: image('RIVER CITY') },
  { id: 'captain-tsubasa-ii', titleZh: '天使之翼2', titleOriginal: 'Captain Tsubasa Vol. II', aliases: ['足球小将2'], year: 1990, publisher: 'Tecmo', genre: '体育', popularity: 86, imageUrl: image('TSUBASA') },
  { id: 'saint-seiya', titleZh: '圣斗士星矢', titleOriginal: 'Saint Seiya: Ougon Densetsu', aliases: ['圣斗士'], year: 1987, publisher: 'Bandai', genre: '角色扮演', popularity: 85, imageUrl: image('SEIYA') },
  { id: 'tmnt', titleZh: '忍者神龟', titleOriginal: 'Teenage Mutant Ninja Turtles', aliases: ['神龟', '忍者龟'], year: 1989, publisher: 'Konami', genre: '动作', popularity: 84, imageUrl: image('TMNT') },
  { id: 'chip-n-dale', titleZh: '松鼠大战', titleOriginal: "Chip 'n Dale: Rescue Rangers", aliases: ['松鼠大作战'], year: 1990, publisher: 'Capcom', genre: '动作', popularity: 83, imageUrl: image('CHIP DALE') },
  { id: 'duck-tales', titleZh: '唐老鸭历险记', titleOriginal: 'DuckTales', aliases: ['鸭子历险记'], year: 1989, publisher: 'Capcom', genre: '动作', popularity: 82, imageUrl: image('DUCKTALES') },
  { id: 'bomberman', titleZh: '炸弹人', titleOriginal: 'Bomberman', aliases: ['炸弹小子'], year: 1985, publisher: 'Hudson Soft', genre: '策略', popularity: 81, imageUrl: image('BOMBERMAN') },
  { id: 'pooyan', titleZh: '猪小弟', titleOriginal: 'Pooyan', aliases: ['小猪射狼'], year: 1985, publisher: 'Konami', genre: '射击', popularity: 80, imageUrl: image('POOYAN') },
  { id: 'load-runner', titleZh: '淘金者', titleOriginal: 'Lode Runner', aliases: ['淘金者一代'], year: 1984, publisher: 'Hudson Soft', genre: '益智', popularity: 79, imageUrl: image('LODE RUNNER') },
  { id: 'mappy', titleZh: '猫捉老鼠', titleOriginal: 'Mappy', aliases: ['警察猫'], year: 1984, publisher: 'Namco', genre: '动作', popularity: 78, imageUrl: image('MAPPY') },
  { id: 'excitebike', titleZh: '越野摩托', titleOriginal: 'Excitebike', aliases: ['摩托车'], year: 1984, publisher: 'Nintendo', genre: '竞速', popularity: 77, imageUrl: image('EXCITEBIKE') },
];
```

- [ ] **Step 4: Run catalog tests**

Run: `npm test -- src/data/fcGames.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit catalog**

```bash
git add src/types.ts src/data/fcGames.ts src/data/fcGames.test.ts
git commit -m "feat: add FC game catalog"
```

## Task 3: Implement Search, Filters, and Sorting

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/lib/search.test.ts`

- [ ] **Step 1: Write search tests**

Create `src/lib/search.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fcGames } from '../data/fcGames';
import { filterGames, sortGames } from './search';

describe('search utilities', () => {
  it('searches Chinese titles and aliases', () => {
    expect(filterGames(fcGames, { query: '魂斗罗' }).map((game) => game.id)).toContain('contra');
    expect(filterGames(fcGames, { query: '超级玛丽' }).map((game) => game.id)).toContain('super-mario-bros');
  });

  it('searches English titles case-insensitively', () => {
    expect(filterGames(fcGames, { query: 'mega man' }).map((game) => game.id)).toContain('rockman-2');
  });

  it('filters by publisher, genre, and decade', () => {
    const result = filterGames(fcGames, {
      publisher: 'Konami',
      genre: '射击',
      decade: '1980s',
    });

    expect(result.map((game) => game.id)).toEqual(expect.arrayContaining(['contra', 'gradius']));
  });

  it('sorts by popularity and year', () => {
    expect(sortGames(fcGames, 'popularity')[0].id).toBe('super-mario-bros');
    expect(sortGames(fcGames, 'year-asc')[0].year).toBe(1984);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/lib/search.test.ts`

Expected: FAIL because `filterGames` and `sortGames` do not exist.

- [ ] **Step 3: Implement search utilities**

Create `src/lib/search.ts`:

```ts
import type { FcGame, GameGenre } from '../types';

export type DecadeFilter = 'all' | '1980s' | '1990s';
export type SortMode = 'popularity' | 'year-asc' | 'year-desc' | 'title';

export interface GameFilters {
  query?: string;
  publisher?: string;
  genre?: GameGenre | 'all';
  decade?: DecadeFilter;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase('zh-CN');

const matchesQuery = (game: FcGame, query: string) => {
  const normalized = normalize(query);
  if (!normalized) return true;

  return [game.titleZh, game.titleOriginal, ...game.aliases]
    .map(normalize)
    .some((value) => value.includes(normalized));
};

const matchesDecade = (game: FcGame, decade: DecadeFilter = 'all') => {
  if (decade === 'all') return true;
  if (decade === '1980s') return game.year >= 1980 && game.year <= 1989;
  return game.year >= 1990 && game.year <= 1999;
};

export const filterGames = (games: FcGame[], filters: GameFilters = {}) =>
  games.filter((game) => {
    if (!matchesQuery(game, filters.query ?? '')) return false;
    if (filters.publisher && game.publisher !== filters.publisher) return false;
    if (filters.genre && filters.genre !== 'all' && game.genre !== filters.genre) return false;
    if (!matchesDecade(game, filters.decade ?? 'all')) return false;
    return true;
  });

export const sortGames = (games: FcGame[], mode: SortMode) => {
  const sorted = [...games];
  if (mode === 'popularity') {
    return sorted.sort((a, b) => b.popularity - a.popularity);
  }
  if (mode === 'year-asc') {
    return sorted.sort((a, b) => a.year - b.year || b.popularity - a.popularity);
  }
  if (mode === 'year-desc') {
    return sorted.sort((a, b) => b.year - a.year || b.popularity - a.popularity);
  }
  return sorted.sort((a, b) => a.titleZh.localeCompare(b.titleZh, 'zh-CN'));
};
```

- [ ] **Step 4: Run search tests**

Run: `npm test -- src/lib/search.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit search utilities**

```bash
git add src/lib/search.ts src/lib/search.test.ts
git commit -m "feat: add FC game search"
```

## Task 4: Implement Selection and Signature Helpers

**Files:**
- Create: `src/lib/selection.ts`
- Create: `src/lib/selection.test.ts`

- [ ] **Step 1: Write selection tests**

Create `src/lib/selection.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { fcGames } from '../data/fcGames';
import { createEmptyGrid, getPosterTitle, isGridComplete, toSnapshot, updateSlot } from './selection';

describe('selection helpers', () => {
  it('creates a 9-slot empty grid', () => {
    expect(createEmptyGrid()).toEqual([null, null, null, null, null, null, null, null, null]);
  });

  it('updates one slot without changing other slots', () => {
    const grid = createEmptyGrid();
    const updated = updateSlot(grid, 3, toSnapshot(fcGames[0]));
    expect(updated[3]?.id).toBe('super-mario-bros');
    expect(grid[3]).toBeNull();
  });

  it('knows when all 9 slots are filled', () => {
    const complete = createEmptyGrid().map((_, index) => toSnapshot(fcGames[index]));
    expect(isGridComplete(complete)).toBe(true);
    expect(isGridComplete(updateSlot(complete, 4, null))).toBe(false);
  });

  it('formats poster titles with optional signature', () => {
    expect(getPosterTitle('')).toBe('我的九个童年神作');
    expect(getPosterTitle('  阿明  ')).toBe('阿明的九个童年神作');
    expect(getPosterTitle('很长很长很长很长的名字')).toBe('很长很长很长很长的的九个童年神作');
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/lib/selection.test.ts`

Expected: FAIL because `src/lib/selection.ts` does not exist.

- [ ] **Step 3: Implement helpers**

Create `src/lib/selection.ts`:

```ts
import type { FcGame, GridSelection, SelectedGameSnapshot } from '../types';

export const MAX_SIGNATURE_LENGTH = 12;

export const createEmptyGrid = (): GridSelection => Array.from({ length: 9 }, () => null);

export const toSnapshot = (game: FcGame): SelectedGameSnapshot => ({
  id: game.id,
  titleZh: game.titleZh,
  titleOriginal: game.titleOriginal,
  year: game.year,
  publisher: game.publisher,
  imageUrl: game.imageUrl,
});

export const updateSlot = (
  grid: GridSelection,
  slotIndex: number,
  game: SelectedGameSnapshot | null,
): GridSelection => {
  if (slotIndex < 0 || slotIndex > 8) {
    return grid;
  }

  return grid.map((slot, index) => (index === slotIndex ? game : slot));
};

export const isGridComplete = (grid: GridSelection) => grid.length === 9 && grid.every(Boolean);

export const normalizeSignature = (signature: string) =>
  signature.trim().slice(0, MAX_SIGNATURE_LENGTH);

export const getPosterTitle = (signature: string) => {
  const normalized = normalizeSignature(signature);
  return normalized ? `${normalized}的九个童年神作` : '我的九个童年神作';
};
```

- [ ] **Step 4: Run selection tests**

Run: `npm test -- src/lib/selection.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit selection helpers**

```bash
git add src/lib/selection.ts src/lib/selection.test.ts
git commit -m "feat: add nine grid selection helpers"
```

## Task 5: Build the Interactive UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/components/SignatureInput.tsx`
- Create: `src/components/Grid.tsx`
- Create: `src/components/GamePicker.tsx`
- Create: `src/components/GeneratePanel.tsx`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write interaction tests**

Create `src/App.test.tsx`:

```tsx
import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('lets a user add a signature and select a game into the first slot', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('署名'), '阿明');
    expect(screen.getByText('阿明的九个童年神作')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '选择第 1 个 FC 游戏' }));
    expect(screen.getByRole('dialog', { name: '选择 FC 游戏' })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('搜索中文名、英文名或别名'), '魂斗罗');
    await user.click(screen.getByRole('button', { name: /选择 魂斗罗/ }));

    const firstSlot = screen.getByTestId('grid-slot-0');
    expect(within(firstSlot).getByText('魂斗罗')).toBeInTheDocument();
  });

  it('keeps generate disabled until all 9 slots are filled', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: '选满 9 个后生成' })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because the components and interactions do not exist yet.

- [ ] **Step 3: Add UI components**

Create `src/components/SignatureInput.tsx`:

```tsx
import { MAX_SIGNATURE_LENGTH, getPosterTitle } from '../lib/selection';

interface SignatureInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SignatureInput({ value, onChange }: SignatureInputProps) {
  return (
    <section className="signature-card">
      <label htmlFor="signature">署名</label>
      <div className="signature-row">
        <input
          id="signature"
          value={value}
          maxLength={MAX_SIGNATURE_LENGTH}
          placeholder="比如：阿明"
          onChange={(event) => onChange(event.target.value)}
        />
        <span>的九个童年神作</span>
      </div>
      <p>{getPosterTitle(value)}</p>
    </section>
  );
}
```

Create `src/components/Grid.tsx`:

```tsx
import type { GridSelection } from '../types';

interface GridProps {
  selection: GridSelection;
  onPickSlot: (slotIndex: number) => void;
}

export function Grid({ selection, onPickSlot }: GridProps) {
  return (
    <section className="grid-section" aria-label="FC 游戏九宫格">
      {selection.map((game, index) => (
        <button
          className={`grid-slot ${game ? 'is-filled' : ''}`}
          key={index}
          type="button"
          data-testid={`grid-slot-${index}`}
          aria-label={game ? `更换第 ${index + 1} 个 FC 游戏：${game.titleZh}` : `选择第 ${index + 1} 个 FC 游戏`}
          onClick={() => onPickSlot(index)}
        >
          {game ? (
            <>
              <img src={game.imageUrl} alt="" />
              <span>{game.titleZh}</span>
            </>
          ) : (
            <span className="slot-plus">+</span>
          )}
        </button>
      ))}
    </section>
  );
}
```

Create `src/components/GamePicker.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { fcGames } from '../data/fcGames';
import { filterGames, sortGames, type DecadeFilter, type SortMode } from '../lib/search';
import type { FcGame, GameGenre } from '../types';

interface GamePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (game: FcGame) => void;
}

export function GamePicker({ open, onClose, onSelect }: GamePickerProps) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GameGenre | 'all'>('all');
  const [decade, setDecade] = useState<DecadeFilter>('all');
  const [sort, setSort] = useState<SortMode>('popularity');

  const games = useMemo(() => {
    const filtered = filterGames(fcGames, { query, genre, decade });
    return sortGames(filtered, sort);
  }, [query, genre, decade, sort]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <section className="picker" role="dialog" aria-modal="true" aria-label="选择 FC 游戏">
        <div className="picker-header">
          <h2>选择 FC 游戏</h2>
          <button type="button" onClick={onClose}>关闭</button>
        </div>

        <input
          className="search-input"
          value={query}
          placeholder="搜索中文名、英文名或别名"
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="filters">
          <select aria-label="类型" value={genre} onChange={(event) => setGenre(event.target.value as GameGenre | 'all')}>
            <option value="all">全部类型</option>
            <option value="动作">动作</option>
            <option value="射击">射击</option>
            <option value="角色扮演">角色扮演</option>
            <option value="体育">体育</option>
            <option value="益智">益智</option>
          </select>
          <select aria-label="年代" value={decade} onChange={(event) => setDecade(event.target.value as DecadeFilter)}>
            <option value="all">全部年代</option>
            <option value="1980s">80 年代</option>
            <option value="1990s">90 年代</option>
          </select>
          <select aria-label="排序" value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
            <option value="popularity">热度</option>
            <option value="year-asc">年份从早到晚</option>
            <option value="year-desc">年份从晚到早</option>
            <option value="title">中文名</option>
          </select>
        </div>

        <div className="game-list">
          {games.map((game) => (
            <button key={game.id} type="button" className="game-card" onClick={() => onSelect(game)} aria-label={`选择 ${game.titleZh}`}>
              <img src={game.imageUrl} alt="" />
              <strong>{game.titleZh}</strong>
              <span>{game.year} · {game.publisher}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
```

Create `src/components/GeneratePanel.tsx`:

```tsx
interface GeneratePanelProps {
  complete: boolean;
  imageUrl: string | null;
  onGenerate: () => void;
}

export function GeneratePanel({ complete, imageUrl, onGenerate }: GeneratePanelProps) {
  return (
    <section className="generate-panel">
      <button type="button" disabled={!complete} onClick={onGenerate}>
        {complete ? '生成分享图' : '选满 9 个后生成'}
      </button>
      {imageUrl && (
        <a className="download-link" href={imageUrl} download="fc-nine-grid.png">
          下载图片
        </a>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Wire components in App**

Replace `src/App.tsx`:

```tsx
import { useState } from 'react';
import { GamePicker } from './components/GamePicker';
import { GeneratePanel } from './components/GeneratePanel';
import { Grid } from './components/Grid';
import { SignatureInput } from './components/SignatureInput';
import { createEmptyGrid, isGridComplete, toSnapshot, updateSlot } from './lib/selection';
import type { FcGame, GridSelection, SelectedGameSnapshot } from './types';

const filledGames = (selection: GridSelection): SelectedGameSnapshot[] =>
  selection.filter((game): game is SelectedGameSnapshot => game !== null);

export default function App() {
  const [signature, setSignature] = useState('');
  const [selection, setSelection] = useState<GridSelection>(() => createEmptyGrid());
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSelectGame = (game: FcGame) => {
    if (activeSlot === null) return;
    setSelection((current) => updateSlot(current, activeSlot, toSnapshot(game)));
    setActiveSlot(null);
    setImageUrl(null);
  };

  return (
    <main className="app-shell">
      <p className="eyebrow">FC 九宫格</p>
      <h1>选出你的 9 个童年神作</h1>
      <SignatureInput value={signature} onChange={setSignature} />
      <Grid selection={selection} onPickSlot={setActiveSlot} />
      <GeneratePanel complete={isGridComplete(selection)} imageUrl={imageUrl} onGenerate={() => setImageUrl('#poster-will-be-added-next')} />
      <GamePicker open={activeSlot !== null} onClose={() => setActiveSlot(null)} onSelect={handleSelectGame} />
    </main>
  );
}
```

- [ ] **Step 5: Add UI styling**

Append to `src/styles.css`:

```css
.signature-card,
.generate-panel {
  margin-top: 18px;
  padding: 14px;
  border: 1px solid #d7cbb9;
  border-radius: 8px;
  background: #fffaf2;
}

.signature-card label {
  display: block;
  margin-bottom: 8px;
  color: #76614f;
  font-size: 13px;
  font-weight: 700;
}

.signature-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.signature-row input {
  min-width: 0;
  flex: 1;
  border: 1px solid #cdbda7;
  border-radius: 6px;
  padding: 10px 12px;
  background: white;
}

.signature-card p {
  margin: 10px 0 0;
  font-weight: 800;
}

.grid-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 18px;
}

.grid-slot {
  aspect-ratio: 1;
  width: 100%;
  overflow: hidden;
  border: 1px dashed #aa9b86;
  border-radius: 8px;
  background: #fbf8f1;
  color: #8b7b68;
  cursor: pointer;
  position: relative;
}

.grid-slot.is-filled {
  border-style: solid;
  border-color: #241f1a;
  color: #f8f0df;
}

.grid-slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.grid-slot span:not(.slot-plus) {
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 6px;
  padding: 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.64);
  font-size: 12px;
  font-weight: 700;
}

.slot-plus {
  font-size: 32px;
}

.generate-panel {
  display: flex;
  gap: 10px;
}

.generate-panel button,
.download-link,
.picker-header button {
  border: 0;
  border-radius: 6px;
  padding: 11px 14px;
  background: #b7352d;
  color: #fffaf2;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.generate-panel button:disabled {
  background: #cfc3b2;
  cursor: not-allowed;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  background: rgba(20, 17, 14, 0.52);
}

.picker {
  width: 100%;
  max-height: 86vh;
  overflow: auto;
  border-radius: 12px 12px 0 0;
  background: #fffaf2;
  padding: 16px;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.picker-header h2 {
  margin: 0;
}

.search-input {
  width: 100%;
  margin-top: 14px;
  border: 1px solid #cdbda7;
  border-radius: 6px;
  padding: 12px;
}

.filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 10px;
}

.filters select {
  border: 1px solid #cdbda7;
  border-radius: 6px;
  padding: 10px;
  background: white;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 14px;
}

.game-card {
  min-width: 0;
  border: 1px solid #e2d6c4;
  border-radius: 8px;
  background: white;
  padding: 8px;
  text-align: left;
  cursor: pointer;
}

.game-card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
  display: block;
}

.game-card strong,
.game-card span {
  display: block;
  margin-top: 6px;
}

.game-card span {
  color: #76614f;
  font-size: 12px;
}

@media (min-width: 720px) {
  .filters {
    grid-template-columns: repeat(3, 1fr);
  }

  .game-list {
    grid-template-columns: repeat(4, 1fr);
  }

  .modal-backdrop {
    align-items: center;
    justify-content: center;
  }

  .picker {
    max-width: 760px;
    border-radius: 12px;
  }
}
```

- [ ] **Step 6: Run UI tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit UI**

```bash
git add src/App.tsx src/App.test.tsx src/styles.css src/components
git commit -m "feat: build FC nine grid picker UI"
```

## Task 6: Implement Poster Generation

**Files:**
- Create: `src/lib/poster.ts`
- Create: `src/lib/poster.test.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write poster tests**

Create `src/lib/poster.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { fcGames } from '../data/fcGames';
import { toSnapshot } from './selection';
import { buildPosterTitle, generatePosterDataUrl } from './poster';

describe('poster generation', () => {
  it('builds the title used on the image', () => {
    expect(buildPosterTitle('阿明')).toBe('阿明的九个童年神作');
    expect(buildPosterTitle('')).toBe('我的九个童年神作');
  });

  it('returns a png data url when canvas is available', async () => {
    const context = {
      fillRect: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
      measureText: vi.fn(() => ({ width: 80 })),
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => context,
          toDataURL: () => 'data:image/png;base64,test',
        } as unknown as HTMLCanvasElement;
      }
      return document.createElement(tagName);
    });

    const image = await generatePosterDataUrl({
      signature: '阿明',
      games: fcGames.slice(0, 9).map(toSnapshot),
      siteLabel: 'fc-grid.fun · 我也来选',
    });

    expect(image).toBe('data:image/png;base64,test');
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/lib/poster.test.ts`

Expected: FAIL because `src/lib/poster.ts` does not exist.

- [ ] **Step 3: Implement poster generation**

Create `src/lib/poster.ts`:

```ts
import type { SelectedGameSnapshot } from '../types';
import { getPosterTitle } from './selection';

interface PosterOptions {
  signature: string;
  games: SelectedGameSnapshot[];
  siteLabel: string;
}

export const buildPosterTitle = (signature: string) => getPosterTitle(signature);

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image failed to load: ${src}`));
    image.src = src;
  });

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const chars = [...text];
  const lines: string[] = [];
  let line = '';

  for (const char of chars) {
    const next = line + char;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, 2);
};

export async function generatePosterDataUrl({ signature, games, siteLabel }: PosterOptions) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not available');
  }

  context.fillStyle = '#221f1a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#d49b6a';
  context.font = '700 36px sans-serif';
  context.fillText('FC NINE GRID', 72, 96);

  context.fillStyle = '#f8f0df';
  context.font = '900 82px sans-serif';
  const titleLines = wrapText(context, buildPosterTitle(signature), 760);
  titleLines.forEach((line, index) => context.fillText(line, 72, 180 + index * 92));

  const images = await Promise.all(
    games.map(async (game) => {
      try {
        return await loadImage(game.imageUrl);
      } catch {
        return null;
      }
    }),
  );

  const gridTop = 380;
  const gap = 18;
  const cell = 300;

  for (let index = 0; index < 9; index += 1) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = 72 + col * (cell + gap);
    const y = gridTop + row * (cell + gap);
    const image = images[index];
    const game = games[index];

    context.fillStyle = '#3a342d';
    context.fillRect(x, y, cell, cell);

    if (image) {
      context.drawImage(image, x, y, cell, cell);
    }

    context.fillStyle = 'rgba(0, 0, 0, 0.68)';
    context.fillRect(x, y + cell - 58, cell, 58);
    context.fillStyle = '#fffaf2';
    context.font = '700 28px sans-serif';
    context.fillText(game.titleZh, x + 16, y + cell - 20);
  }

  context.fillStyle = '#b9aa94';
  context.font = '500 30px sans-serif';
  context.fillText(siteLabel, 72, 1352);

  return canvas.toDataURL('image/png');
}
```

- [ ] **Step 4: Wire poster generation into App**

Modify `src/App.tsx`:

```tsx
import { useState } from 'react';
import { GamePicker } from './components/GamePicker';
import { GeneratePanel } from './components/GeneratePanel';
import { Grid } from './components/Grid';
import { SignatureInput } from './components/SignatureInput';
import { generatePosterDataUrl } from './lib/poster';
import { createEmptyGrid, isGridComplete, toSnapshot, updateSlot } from './lib/selection';
import type { FcGame, GridSelection } from './types';

export default function App() {
  const [signature, setSignature] = useState('');
  const [selection, setSelection] = useState<GridSelection>(() => createEmptyGrid());
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const complete = isGridComplete(selection);

  const handleSelectGame = (game: FcGame) => {
    if (activeSlot === null) return;
    setSelection((current) => updateSlot(current, activeSlot, toSnapshot(game)));
    setActiveSlot(null);
    setImageUrl(null);
  };

  const handleGenerate = async () => {
    if (!complete) return;
    setIsGenerating(true);
    const dataUrl = await generatePosterDataUrl({
      signature,
      games: filledGames(selection),
      siteLabel: 'fc-grid.fun · 我也来选',
    });
    setImageUrl(dataUrl);
    setIsGenerating(false);
  };

  return (
    <main className="app-shell">
      <p className="eyebrow">FC 九宫格</p>
      <h1>选出你的 9 个童年神作</h1>
      <SignatureInput value={signature} onChange={setSignature} />
      <Grid selection={selection} onPickSlot={setActiveSlot} />
      <GeneratePanel complete={complete && !isGenerating} imageUrl={imageUrl} onGenerate={handleGenerate} />
      <GamePicker open={activeSlot !== null} onClose={() => setActiveSlot(null)} onSelect={handleSelectGame} />
    </main>
  );
}
```

- [ ] **Step 5: Run poster and UI tests**

Run: `npm test -- src/lib/poster.test.ts src/App.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit poster generation**

```bash
git add src/lib/poster.ts src/lib/poster.test.ts src/App.tsx
git commit -m "feat: generate FC nine grid poster"
```

## Task 7: Final Verification and Browser QA

**Files:**
- Modify only files needed to fix verification issues.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`

Expected: PASS for all tests.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: TypeScript and Vite build succeed.

- [ ] **Step 3: Start local dev server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 4: Browser QA on desktop and mobile widths**

Use the Browser plugin to open the local URL. Verify:

- The first screen is the actual picker, not a marketing landing page.
- The signature field updates the title preview.
- Clicking a grid slot opens the picker.
- Searching `魂斗罗` returns 魂斗罗.
- Selecting a game fills the slot.
- Filled slots can be changed.
- Generate remains disabled until 9 slots are filled.
- After 9 selections, generating creates a downloadable image.
- At mobile width, no text overlaps and the grid stays within the viewport.

- [ ] **Step 5: Fix any QA issues and rerun verification**

For each issue found, modify the smallest relevant file, then rerun:

```bash
npm test
npm run build
```

Expected: both commands PASS.

- [ ] **Step 6: Commit verification fixes**

If fixes were made:

```bash
git add src package.json package-lock.json index.html vite.config.ts tsconfig.json
git commit -m "fix: polish FC nine grid MVP"
```

If no fixes were needed, skip this commit.

## Self-Review

- Spec coverage: The plan covers signature input, 3x3 grid, FC game picker, search/filter/sort, no account system, no public share page, and client-side image generation.
- Non-goals preserved: No login, no community, no personal homepage, no post-publish editing, no multi-template system, and no upload-first flow.
- Data scope: The first implementation seeds 24 games so the picker is testable immediately. A content expansion pass can raise `src/data/fcGames.ts` to 200+ entries using the same schema while keeping `src/data/fcGames.test.ts` passing.
- Placeholder scan: No undefined implementation hooks remain in the executable tasks.
- Type consistency: `FcGame`, `SelectedGameSnapshot`, `GridSelection`, `filterGames`, `sortGames`, `toSnapshot`, and `generatePosterDataUrl` use consistent names across tasks.
