import { ArrowRight } from '@phosphor-icons/react';
import { useMemo, useState, type ReactNode } from 'react';
import { getDecadeOptions, getGenreOptions } from '../data/catalogs';
import { dramaShows } from '../data/experiences';
import { generatePosterDataUrl } from '../lib/poster';
import { createEmptyGrid, isGridComplete, toSnapshot, updateSlot } from '../lib/selection';
import type { GridSelection, SelectedGameSnapshot } from '../types';
import { GamePicker } from './GamePicker';
import { PosterModal } from './PosterModal';
import { ThemedGrid } from './ThemedGrid';
import { ClassicDramaExperience } from './ClassicDramaExperience';

const prompts = [
  { id: 'favorite', index: '01', label: '九部最爱', heading: '这个夏天，\n让你上头的\n九部剧', suffix: '的夏日剧单' },
  { id: 'unfinished', index: '02', label: '最意难平', heading: '九个故事，\n至今仍让你\n意难平', suffix: '的意难平剧单' },
  { id: 'rewatch', index: '03', label: '最想重看', heading: '如果重来，\n还会再追的\n九部剧', suffix: '最想重看的九部剧' },
  { id: 'underrated', index: '04', label: '我心中的被低估', heading: '这九部剧，\n值得被更多人\n看见', suffix: '心中的九部遗珠' },
] as const;

const previewSelection = [
  ...dramaShows.slice(0, 8).map(toSnapshot),
  null,
] as GridSelection;

export function DramaExperience() {
  const [mode, setMode] = useState<'current' | 'classic'>('current');
  const switcher = (
    <div className="drama-category-switch" aria-label="剧集类型">
      <button type="button" className={mode === 'current' ? 'is-active' : ''} onClick={() => setMode('current')}>当季热剧</button>
      <button type="button" className={mode === 'classic' ? 'is-active' : ''} onClick={() => setMode('classic')}>经典剧集</button>
    </div>
  );

  return mode === 'classic'
    ? <ClassicDramaExperience headerSlot={switcher} />
    : <CurrentDramaExperience headerSlot={switcher} />;
}

interface CurrentDramaExperienceProps {
  headerSlot: ReactNode;
}

function CurrentDramaExperience({ headerSlot }: CurrentDramaExperienceProps) {
  const [promptId, setPromptId] = useState<(typeof prompts)[number]['id']>('favorite');
  const [selection, setSelection] = useState<GridSelection>(previewSelection);
  const [signature, setSignature] = useState('小满');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const prompt = prompts.find((item) => item.id === promptId) ?? prompts[0];
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

  const selectShow = (show: (typeof dramaShows)[number]) => {
    if (activeSlot === null) return;
    setSelection((current) => updateSlot(current, activeSlot, toSnapshot(show)));
    setActiveSlot(null);
  };

  const generate = async () => {
    if (!complete || isGenerating) return;
    setIsGenerating(true);
    try {
      setImageUrl(await generatePosterDataUrl({
        signature,
        games: selectedItems,
        siteLabel: '偏爱 · 夏日剧单',
        titleSuffix: prompt.suffix,
        brandLabel: 'PROMPT MAGAZINE · SUMMER 2026',
        theme: 'drama',
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrimary = () => {
    if (isPreview) {
      beginSelection();
      return;
    }
    if (complete) {
      void generate();
      return;
    }
    setActiveSlot(selection.findIndex((item) => item === null));
  };

  return (
    <section
      className="drama-experience"
      aria-labelledby="drama-heading"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/themes/drama-paper.png)` }}
    >
      {headerSlot}
      <div className="drama-layout">
        <div className="drama-copy">
          <span className="drama-issue">本期命题 · TIMELY PROMPT</span>
          <h1 id="drama-heading">
            {prompt.heading.split('\n').map((line, index) => <span key={line} className={index === 2 ? 'is-accent' : ''}>{line}</span>)}
          </h1>
          <p>选出最上头的九部剧，生成专属夏日剧单封面。</p>
          <button className="drama-primary" type="button" onClick={handlePrimary}>
            {isGenerating ? '正在生成' : isPreview ? '开始选剧' : complete ? '生成剧单封面' : '继续选剧'}
            <ArrowRight size={24} weight="bold" />
          </button>
          <div className="drama-progress" aria-label={`已选 ${selectedItems.length} 部，共 9 部`}>
            <strong>{selectedItems.length.toString().padStart(2, '0')}</strong>
            <span>/ 09</span>
            <small>{complete ? '可以生成封面' : `还差 ${9 - selectedItems.length} 部`}</small>
          </div>
          <label className="drama-signature">
            <span>封面署名</span>
            <input value={signature} maxLength={12} placeholder="比如：小满" onChange={(event) => setSignature(event.target.value)} />
          </label>
          <div className="drama-prompt-list" aria-label="选择剧单命题">
            <p>更多命题</p>
            {prompts.map((item) => (
              <button key={item.id} type="button" className={promptId === item.id ? 'is-active' : ''} onClick={() => setPromptId(item.id)}>
                <span>{item.index}</span>
                <strong>{item.label}</strong>
                <ArrowRight size={16} weight="bold" />
              </button>
            ))}
          </div>
        </div>

        <div className="drama-grid-area">
          <ThemedGrid selection={selection} variant="drama" itemLabel="剧集" onPickSlot={pickSlot} />
          <p className="drama-grid-caption">DRAMA PICKS · SUMMER 2026</p>
        </div>

        <aside className="drama-share-preview" aria-label="分享封面预览">
          <p>你的夏日剧单</p>
          <small>分享封面预览</small>
          <div className="drama-paper-poster">
            <span className="drama-paper-brand">偏爱</span>
            <h2>{signature || '你的'}的<br /><strong>{prompt.label}</strong></h2>
            <div>
              {selection.map((item, index) => item ? <img key={item.id} src={item.imageUrl} alt="" /> : <button key={index} type="button" aria-label="选择最后一部剧" onClick={() => pickSlot(index)}>+</button>)}
            </div>
            <em>09</em>
          </div>
          <strong className="drama-preview-signature">{signature || '你的'}的夏日剧单</strong>
        </aside>
      </div>

      <GamePicker
        key={`drama-${activeSlot ?? 'closed'}`}
        open={activeSlot !== null}
        items={dramaShows}
        title="选择一部剧"
        variant="drama"
        genreOptions={getGenreOptions(dramaShows)}
        decadeOptions={getDecadeOptions(dramaShows)}
        unavailableGameIds={unavailableIds}
        onClose={() => setActiveSlot(null)}
        onSelect={selectShow}
      />
      <PosterModal imageUrl={imageUrl} downloadName="summer-drama-list.png" alt="夏日剧单分享封面" onClose={() => setImageUrl(null)} />
    </section>
  );
}
