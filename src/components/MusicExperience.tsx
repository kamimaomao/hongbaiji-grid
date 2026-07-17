import { ArrowRight, DownloadSimple } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { getDecadeOptions, getGenreOptions } from '../data/catalogs';
import { musicAlbums } from '../data/experiences';
import { generatePosterDataUrl } from '../lib/poster';
import { createEmptyGrid, isGridComplete, toSnapshot, updateSlot } from '../lib/selection';
import type { GridSelection, SelectedGameSnapshot } from '../types';
import { GamePicker } from './GamePicker';
import { PosterModal } from './PosterModal';
import { ThemedGrid } from './ThemedGrid';

const previewSelection = musicAlbums.slice(0, 9).map(toSnapshot) as GridSelection;

export function MusicExperience() {
  const [selection, setSelection] = useState<GridSelection>(previewSelection);
  const [signature, setSignature] = useState('阿明');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedItems = selection.filter((item): item is SelectedGameSnapshot => item !== null);
  const complete = isGridComplete(selection);
  const unavailableIds = useMemo(
    () => new Set(selection.filter((item, index): item is SelectedGameSnapshot => item !== null && index !== activeSlot).map((item) => item.id)),
    [activeSlot, selection],
  );

  const beginSelection = () => {
    setSelection(createEmptyGrid());
    setSignature('');
    setIsPreview(false);
    setImageUrl(null);
    setActiveSlot(0);
  };

  const pickSlot = (index: number) => {
    if (isPreview) {
      setSelection(createEmptyGrid());
      setSignature('');
      setIsPreview(false);
    }
    setImageUrl(null);
    setActiveSlot(index);
  };

  const selectAlbum = (album: (typeof musicAlbums)[number]) => {
    if (activeSlot === null) return;
    setSelection((current) => updateSlot(current, activeSlot, toSnapshot(album)));
    setActiveSlot(null);
  };

  const generate = async () => {
    if (!complete || isGenerating) return;
    setIsGenerating(true);
    try {
      setImageUrl(await generatePosterDataUrl({
        signature,
        games: selectedItems,
        siteLabel: '偏爱 · 音乐九宫格',
        titleSuffix: '的九张人生专辑',
        brandLabel: 'FAVORITE RECORDS',
        theme: 'music',
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section
      className="music-experience"
      aria-labelledby="music-heading"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/themes/music-room.png)` }}
    >
      <div className="music-stage">
        <div className="music-copy">
          <p className="music-kicker">NINE FAVORITE RECORDS</p>
          <h1 id="music-heading">选出伴你最久<br />的九张专辑</h1>
          <p>回到开始的那一刻，选出一直陪伴你的音乐。</p>
          <button className="music-primary" type="button" onClick={beginSelection}>
            开始选择
            <ArrowRight size={24} weight="bold" />
          </button>
          <div className="music-mode-tabs" aria-label="当前玩法">
            <span className="is-active">九宫格</span>
            <span>二选一</span>
            <span>排座次</span>
          </div>
          <label className="music-signature">
            <span>署名</span>
            <input value={signature} maxLength={12} placeholder="比如：阿明" onChange={(event) => setSignature(event.target.value)} />
          </label>
        </div>

        <div className="music-grid-area">
          <ThemedGrid selection={selection} variant="music" itemLabel="专辑" onPickSlot={pickSlot} />
          <div className="music-grid-footer">
            <span>{selectedItems.length.toString().padStart(2, '0')} / 09</span>
            <button type="button" disabled={!complete || isGenerating} onClick={generate}>
              <DownloadSimple size={18} weight="bold" />
              {isGenerating ? '正在生成' : '生成分享海报'}
            </button>
          </div>
        </div>

        <aside className="music-share-sample" aria-label="分享海报预览">
          <p>{signature || '你的'}的九张人生专辑</p>
          <div>
            {selection.map((item, index) => item ? <img key={item.id} src={item.imageUrl} alt="" /> : <span key={index}>{index + 1}</span>)}
          </div>
          <small>在音乐里，我们成为了彼此的时光。</small>
          <strong>偏爱</strong>
        </aside>
      </div>

      <GamePicker
        key={`music-${activeSlot ?? 'closed'}`}
        open={activeSlot !== null}
        items={musicAlbums}
        title="选择一张专辑"
        variant="music"
        searchCategory="music"
        genreOptions={getGenreOptions(musicAlbums)}
        decadeOptions={getDecadeOptions(musicAlbums)}
        unavailableGameIds={unavailableIds}
        onClose={() => setActiveSlot(null)}
        onSelect={selectAlbum}
      />
      <PosterModal imageUrl={imageUrl} downloadName="favorite-records.png" alt="音乐九宫格分享海报" onClose={() => setImageUrl(null)} />
    </section>
  );
}
