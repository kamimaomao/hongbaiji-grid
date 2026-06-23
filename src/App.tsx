import { useMemo, useState } from 'react';
import { GamePicker } from './components/GamePicker';
import { GeneratePanel } from './components/GeneratePanel';
import { Grid } from './components/Grid';
import { SignatureInput } from './components/SignatureInput';
import { generatePosterDataUrl } from './lib/poster';
import { createEmptyGrid, isGridComplete, toSnapshot, updateSlot } from './lib/selection';
import type { FcGame, GridSelection, SelectedGameSnapshot } from './types';

const filledGames = (selection: GridSelection): SelectedGameSnapshot[] =>
  selection.filter((game): game is SelectedGameSnapshot => game !== null);

export default function App() {
  const [signature, setSignature] = useState('');
  const [selection, setSelection] = useState<GridSelection>(() => createEmptyGrid());
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
      siteLabel: 'hongbaiji-grid · 我也来选',
    });
    setImageUrl(dataUrl);
    setIsGenerating(false);
  };

  return (
    <main className="app-shell">
      <p className="eyebrow">红白机九宫格</p>
      <h1>选出你最喜欢的红白机游戏</h1>
      <SignatureInput value={signature} onChange={setSignature} />
      <Grid selection={selection} onPickSlot={setActiveSlot} />
      <GeneratePanel complete={complete && !isGenerating} imageUrl={imageUrl} onGenerate={handleGenerate} />
      <GamePicker
        open={activeSlot !== null}
        unavailableGameIds={unavailableGameIds}
        onClose={() => setActiveSlot(null)}
        onSelect={handleSelectGame}
      />
    </main>
  );
}
