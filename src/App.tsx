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
    <main className="app-shell">
      <p className="eyebrow">{catalog.eyebrow}</p>
      <h1>{catalog.heading}</h1>
      <div className="mode-switch" aria-label="选择主题">
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
      <SignatureInput value={signature} titleSuffix={catalog.titleSuffix} onChange={setSignature} />
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
      <GamePicker
        open={activeSlot !== null}
        items={catalogItems}
        title={catalog.pickerTitle}
        genreOptions={genreOptions}
        decadeOptions={decadeOptions}
        unavailableGameIds={unavailableGameIds}
        onClose={() => setActiveSlot(null)}
        onSelect={handleSelectGame}
      />
    </main>
  );
}
