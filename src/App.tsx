import { useEffect, useMemo, useState } from 'react';
import { GamePicker } from './components/GamePicker';
import { GeneratePanel } from './components/GeneratePanel';
import { Grid } from './components/Grid';
import { SignatureInput } from './components/SignatureInput';
import { catalogConfigs, getDecadeOptions, getGenreOptions } from './data/catalogs';
import { fcGames } from './data/fcGames';
import { generatePosterDataUrl } from './lib/poster';
import { createEmptyGrid, isGridComplete, toSnapshot, updateSlot } from './lib/selection';
import type { CatalogMode, FcGame, GridSelection, SelectedGameSnapshot } from './types';

const filledGames = (selection: GridSelection): SelectedGameSnapshot[] =>
  selection.filter((game): game is SelectedGameSnapshot => game !== null);

export default function App() {
  const [mode, setMode] = useState<CatalogMode>('fc');
  const [signature, setSignature] = useState('');
  const [selection, setSelection] = useState<GridSelection>(() => createEmptyGrid());
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animeItems, setAnimeItems] = useState<FcGame[]>([]);

  const catalog = catalogConfigs[mode];
  const catalogItems = mode === 'fc' ? fcGames : animeItems;
  const genreOptions = useMemo(() => getGenreOptions(catalogItems), [catalogItems]);
  const decadeOptions = useMemo(() => getDecadeOptions(catalogItems), [catalogItems]);
  const complete = isGridComplete(selection);
  const selectedCount = filledGames(selection).length;
  const unavailableGameIds = useMemo(
    () =>
      new Set(
        selection
          .filter((game, index): game is SelectedGameSnapshot => game !== null && index !== activeSlot)
          .map((game) => game.id),
      ),
    [activeSlot, selection],
  );

  useEffect(() => {
    if (mode !== 'anime' || animeItems.length > 0) return;
    let cancelled = false;
    void import('./data/animeCatalog').then(({ animeCatalog }) => {
      if (!cancelled) {
        setAnimeItems(animeCatalog);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [animeItems.length, mode]);

  const handleSelectGame = (game: FcGame) => {
    if (activeSlot === null) return;
    setSelection((current) => updateSlot(current, activeSlot, toSnapshot(game)));
    setActiveSlot(null);
    setImageUrl(null);
  };

  const handleModeChange = (nextMode: CatalogMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setSelection(createEmptyGrid());
    setActiveSlot(null);
    setImageUrl(null);
  };

  const handleGenerate = async () => {
    if (!complete) return;
    setIsGenerating(true);
    try {
      const dataUrl = await generatePosterDataUrl({
        signature,
        games: filledGames(selection),
        siteLabel: catalog.siteLabel,
        titleSuffix: catalog.titleSuffix,
        brandLabel: catalog.posterBrand,
      });
      setImageUrl(dataUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className={`app-shell theme-${mode}`}>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#editor" aria-label="九格回忆首页">
            <span className="brand-mark" aria-hidden="true">3×3</span>
            <span>九格回忆</span>
          </a>
          <a className="header-action" href="#workspace">开始制作</a>
        </div>
      </header>

      <section className="editor-layout" id="editor">
        <div className="project-intro">
          <p className="eyebrow">NINE FAVORITES</p>
          <h1 id="page-title">{catalog.heading}</h1>
          <p className="hero-copy">选出九个真正喜欢的名字，生成一张属于你的九宫格。无需登录，完成后即可保存。</p>
        </div>

        <div className="workspace-grid" id="workspace">
          <aside className="settings-panel" aria-label="九宫格设置">
            <div className="panel-heading">
              <p className="step-label">设置</p>
              <h2>创建你的作品</h2>
            </div>

            <div className="setting-group">
              <p className="setting-label">主题</p>
              <div className="mode-switch" aria-label="选择九宫格主题">
                {Object.values(catalogConfigs).map((config) => (
                  <button
                    key={config.mode}
                    type="button"
                    aria-pressed={mode === config.mode}
                    onClick={() => handleModeChange(config.mode)}
                  >
                    {config.navLabel}
                  </button>
                ))}
              </div>
            </div>

            <SignatureInput value={signature} titleSuffix={catalog.titleSuffix} onChange={setSignature} />

            <div className="privacy-card">
              <span className="privacy-symbol" aria-hidden="true">✓</span>
              <div>
                <strong>你的选择只留在这里</strong>
                <p>不创建账号，也不会上传你的九宫格。</p>
              </div>
            </div>
          </aside>

          <section className="grid-panel" aria-label="九宫格编辑区">
            <div className="section-heading">
              <div>
                <p className="step-label">你的九宫格</p>
                <h2>{selectedCount === 0 ? '点击任意格子开始选择' : '继续填满你的九个心头好'}</h2>
              </div>
              <span className="selection-count" aria-live="polite">已选 {selectedCount} / 9</span>
            </div>

            <Grid
              selection={selection}
              gridLabel={catalog.gridLabel}
              slotItemLabel={catalog.slotItemLabel}
              onPickSlot={setActiveSlot}
            />
            <GeneratePanel
              complete={complete && !isGenerating}
              imageUrl={imageUrl}
              downloadName={catalog.downloadName}
              onGenerate={handleGenerate}
            />
          </section>
        </div>
      </section>

      <GamePicker
        key={`${mode}-${activeSlot ?? 'closed'}`}
        open={activeSlot !== null}
        items={catalogItems}
        title={catalog.pickerTitle}
        genreOptions={genreOptions}
        decadeOptions={decadeOptions}
        unavailableGameIds={unavailableGameIds}
        onClose={() => setActiveSlot(null)}
        onSelect={handleSelectGame}
      />
      <footer><span>九格回忆</span><span>为你喜欢的事物，留一个位置。</span></footer>
    </main>
  );
}
