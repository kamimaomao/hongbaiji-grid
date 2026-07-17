import { ArrowRight, DownloadSimple } from '@phosphor-icons/react';
import { useMemo, useState, type ReactNode } from 'react';
import { getDecadeOptions, getGenreOptions } from '../data/catalogs';
import { generatePosterDataUrl, type PosterTheme } from '../lib/poster';
import { createEmptyGrid, isGridComplete, toSnapshot, updateSlot } from '../lib/selection';
import type { CatalogItem, CollectionVariant, GameGenre, GridSelection, SelectedGameSnapshot } from '../types';
import { GamePicker } from './GamePicker';
import { PosterModal } from './PosterModal';
import { ThemedGrid } from './ThemedGrid';

export interface CollectionPrompt {
  id: string;
  index: string;
  label: string;
  titleSuffix: string;
}

export interface CollectionExperienceConfig {
  variant: CollectionVariant;
  items: CatalogItem[];
  backgroundAsset: string;
  kicker: string;
  titleLines: string[];
  accentLine?: number;
  description: string;
  startLabel: string;
  signatureLabel: string;
  signaturePlaceholder: string;
  previewSignature: string;
  itemLabel: string;
  pickerTitle: string;
  quickFilters: string[];
  shareTitle: (signature: string, prompt?: CollectionPrompt) => string;
  shareCaption: string;
  titleSuffix: string;
  posterBrand: string;
  posterSiteLabel: string;
  posterTheme: PosterTheme;
  downloadName: string;
  prompts?: CollectionPrompt[];
}

interface CollectionExperienceProps {
  config: CollectionExperienceConfig;
  headerSlot?: ReactNode;
}

export function CollectionExperience({ config, headerSlot }: CollectionExperienceProps) {
  const previewSelection = config.items.slice(0, 9).map(toSnapshot) as GridSelection;
  const [selection, setSelection] = useState<GridSelection>(previewSelection);
  const [signature, setSignature] = useState(config.previewSignature);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [pickerGenre, setPickerGenre] = useState<GameGenre | 'all'>('all');
  const [isPreview, setIsPreview] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptId, setPromptId] = useState(config.prompts?.[0]?.id ?? 'default');

  const prompt = config.prompts?.find((item) => item.id === promptId);
  const selectedItems = selection.filter((item): item is SelectedGameSnapshot => item !== null);
  const complete = isGridComplete(selection);
  const unavailableIds = useMemo(
    () => new Set(selection.filter((item, index): item is SelectedGameSnapshot => item !== null && index !== activeSlot).map((item) => item.id)),
    [activeSlot, selection],
  );

  const openSlot = (index: number, genre: GameGenre | 'all' = 'all') => {
    if (isPreview) {
      setSelection(createEmptyGrid());
      setSignature('');
      setIsPreview(false);
    }
    setPickerGenre(genre);
    setImageUrl(null);
    setActiveSlot(index);
  };

  const beginSelection = () => openSlot(0);

  const selectItem = (item: CatalogItem) => {
    if (activeSlot === null) return;
    setSelection((current) => updateSlot(current, activeSlot, toSnapshot(item)));
    setActiveSlot(null);
    setImageUrl(null);
  };

  const generate = async () => {
    if (!complete || isGenerating) return;
    setIsGenerating(true);
    try {
      setImageUrl(await generatePosterDataUrl({
        signature,
        games: selectedItems,
        siteLabel: config.posterSiteLabel,
        titleSuffix: prompt?.titleSuffix ?? config.titleSuffix,
        brandLabel: config.posterBrand,
        theme: config.posterTheme,
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
    openSlot(selection.findIndex((item) => item === null));
  };

  const openFilter = (genre: string) => {
    const slot = selection.findIndex((item) => item === null);
    openSlot(slot === -1 ? 0 : slot, genre);
  };

  return (
    <section
      className={`collection-experience collection-${config.variant}`}
      aria-labelledby={`${config.variant}-heading`}
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${config.backgroundAsset})` }}
    >
      {headerSlot}
      <div className="collection-stage">
        <div className="collection-copy">
          <p className="collection-kicker">{config.kicker}</p>
          <h1 id={`${config.variant}-heading`}>
            {config.titleLines.map((line, index) => (
              <span key={line} className={config.accentLine === index ? 'is-accent' : ''}>{line}</span>
            ))}
          </h1>
          <p className="collection-description">{config.description}</p>

          <button className="collection-primary" type="button" onClick={handlePrimary}>
            {isGenerating ? '正在生成' : isPreview ? config.startLabel : complete ? '生成分享海报' : '继续选择'}
            <ArrowRight size={22} weight="bold" />
          </button>

          <div className="collection-filter-row" aria-label={`${config.itemLabel}快捷分类`}>
            {config.quickFilters.map((genre) => (
              <button key={genre} type="button" onClick={() => openFilter(genre)}>{genre}</button>
            ))}
          </div>

          <label className="collection-signature">
            <span>{config.signatureLabel}</span>
            <input
              value={signature}
              maxLength={12}
              placeholder={config.signaturePlaceholder}
              onChange={(event) => setSignature(event.target.value)}
            />
          </label>

          {config.prompts && (
            <div className="collection-prompt-list" aria-label="选择分享命题">
              {config.prompts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === promptId ? 'is-active' : ''}
                  onClick={() => setPromptId(item.id)}
                >
                  <span>{item.index}</span>
                  <strong>{item.label}</strong>
                  <ArrowRight size={15} weight="bold" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="collection-grid-shell">
          <ThemedGrid selection={selection} variant={config.variant} itemLabel={config.itemLabel} onPickSlot={openSlot} />
          <div className="collection-grid-footer">
            <span>{selectedItems.length.toString().padStart(2, '0')} / 09</span>
            <button type="button" disabled={!complete || isGenerating} onClick={() => void generate()}>
              <DownloadSimple size={18} weight="bold" />
              {isGenerating ? '正在生成' : '生成分享海报'}
            </button>
          </div>
        </div>

        <aside className="collection-share-preview" aria-label="分享海报预览">
          <p>{config.shareTitle(signature || '我', prompt)}</p>
          <div className="collection-share-grid">
            {selection.map((item, index) => item
              ? <img key={item.id} src={item.imageUrl} alt="" />
              : <button key={index} type="button" aria-label={`选择第 ${index + 1} 个${config.itemLabel}`} onClick={() => openSlot(index)}>+</button>)}
          </div>
          <small>{config.shareCaption}</small>
          <strong>{signature || '偏爱'}</strong>
        </aside>
      </div>

      <GamePicker
        key={`${config.variant}-${activeSlot ?? 'closed'}-${pickerGenre}`}
        open={activeSlot !== null}
        items={config.items}
        title={config.pickerTitle}
        variant={config.variant}
        initialGenre={pickerGenre}
        genreOptions={getGenreOptions(config.items)}
        decadeOptions={getDecadeOptions(config.items)}
        unavailableGameIds={unavailableIds}
        onClose={() => setActiveSlot(null)}
        onSelect={selectItem}
      />
      <PosterModal
        imageUrl={imageUrl}
        downloadName={config.downloadName}
        alt={`${config.itemLabel}分享海报`}
        onClose={() => setImageUrl(null)}
      />
    </section>
  );
}
