import { ArrowCounterClockwise, ArrowsClockwise, Crown, DownloadSimple } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { duelAnime } from '../data/experiences';
import { generateDuelPosterDataUrl } from '../lib/poster';
import { searchRemoteCatalog } from '../lib/remoteCatalog';
import type { CatalogItem } from '../types';
import { PosterModal } from './PosterModal';

interface EliminatedItem {
  item: CatalogItem;
  round: number;
}

interface DuelState {
  queue: CatalogItem[];
  winners: CatalogItem[];
  eliminated: EliminatedItem[];
  round: number;
  matchNumber: number;
  champion: CatalogItem | null;
}

const createDuelState = (items: CatalogItem[] = duelAnime): DuelState => ({
  queue: items.slice(0, 16),
  winners: [],
  eliminated: [],
  round: 1,
  matchNumber: 1,
  champion: null,
});

export function AnimeDuel() {
  const [state, setState] = useState<DuelState>(createDuelState);
  const [animePool, setAnimePool] = useState<CatalogItem[]>(duelAnime);
  const [history, setHistory] = useState<DuelState[]>([]);
  const [signature, setSignature] = useState('阿哲');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    void searchRemoteCatalog('anime', '', 'all', 'all', controller.signal)
      .then((items) => {
        if (items.length < 16) return;
        const providerPool = items.slice(0, 16);
        setAnimePool(providerPool);
        if (!hasInteracted.current) setState(createDuelState(providerPool));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const left = state.queue[0] ?? null;
  const right = state.queue[1] ?? null;
  const previewWinner = state.champion ?? state.winners[state.winners.length - 1] ?? left;
  const topFour = useMemo(() => {
    const ranked = [...state.eliminated]
      .sort((a, b) => b.round - a.round)
      .map((entry) => entry.item);
    return [state.champion, ...ranked].filter((item): item is CatalogItem => item !== null).slice(0, 4);
  }, [state.champion, state.eliminated]);

  const choose = (winner: CatalogItem, loser: CatalogItem) => {
    if (state.champion) return;
    hasInteracted.current = true;
    setHistory((current) => [...current, state]);
    setImageUrl(null);

    const remaining = state.queue.slice(2);
    const roundWinners = [...state.winners, winner];
    const eliminated = [...state.eliminated, { item: loser, round: state.round }];

    if (remaining.length > 0) {
      setState({ ...state, queue: remaining, winners: roundWinners, eliminated, matchNumber: state.matchNumber + 1 });
      return;
    }

    if (roundWinners.length === 1) {
      setState({ ...state, queue: [], winners: [], eliminated, champion: winner, matchNumber: 15 });
      return;
    }

    setState({
      queue: roundWinners,
      winners: [],
      eliminated,
      round: state.round + 1,
      matchNumber: state.matchNumber + 1,
      champion: null,
    });
  };

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setState(previous);
    setHistory((current) => current.slice(0, -1));
    setImageUrl(null);
  };

  const skipPair = () => {
    if (state.queue.length <= 2) return;
    setState({ ...state, queue: [...state.queue.slice(2), ...state.queue.slice(0, 2)] });
  };

  const restart = () => {
    hasInteracted.current = false;
    setState(createDuelState(animePool));
    setHistory([]);
    setImageUrl(null);
  };

  const generate = async () => {
    if (!state.champion || isGenerating) return;
    setIsGenerating(true);
    try {
      setImageUrl(await generateDuelPosterDataUrl({
        signature,
        champion: state.champion,
        topFour,
        eliminated: state.eliminated.map((entry) => entry.item),
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section
      className="anime-duel"
      aria-labelledby="duel-heading"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/themes/anime-duel-paper.png)` }}
    >
      <div className="duel-main">
        <div className="duel-title-row">
          <span className="duel-match-number" aria-label={`第 ${state.matchNumber} 场，共 15 场`}>第 <strong>{state.matchNumber}</strong> 场 / 共 15 场</span>
          <h1 id="duel-heading">{state.champion ? '你的冠军已经诞生' : '只能留一个，你选谁？'}</h1>
          <button className="icon-button duel-undo" type="button" disabled={history.length === 0} aria-label="撤销上一次选择" title="撤销" onClick={undo}>
            <ArrowCounterClockwise size={28} weight="bold" />
          </button>
        </div>

        {state.champion ? (
          <div className="duel-champion-stage">
            <img src={state.champion.imageUrl} alt="" />
            <span><Crown size={36} weight="fill" /> 动漫冠军</span>
            <h2>{state.champion.titleZh}</h2>
            <p>{state.champion.titleOriginal}</p>
            <div>
              <button type="button" onClick={() => void generate()}><DownloadSimple size={20} weight="bold" />{isGenerating ? '正在生成' : '生成冠军海报'}</button>
              <button type="button" onClick={restart}><ArrowsClockwise size={20} weight="bold" />再来一次</button>
            </div>
          </div>
        ) : left && right ? (
          <>
            <div className="duel-cards">
              <button className="duel-card duel-card-a" type="button" onClick={() => choose(left, right)}>
                <span className="duel-letter">A</span>
                <div className="duel-card-copy"><strong>{left.titleZh}</strong><small>{left.titleOriginal}</small></div>
                <img src={left.imageUrl} alt="" />
                <span className="duel-pick-label">点击选择 A</span>
              </button>
              <span className="duel-vs" aria-hidden="true">VS</span>
              <button className="duel-card duel-card-b" type="button" onClick={() => choose(right, left)}>
                <span className="duel-letter">B</span>
                <div className="duel-card-copy"><strong>{right.titleZh}</strong><small>{right.titleOriginal}</small></div>
                <img src={right.imageUrl} alt="" />
                <span className="duel-pick-label">点击选择 B</span>
              </button>
            </div>
            <button className="duel-skip" type="button" disabled={state.queue.length <= 2} onClick={skipPair}>
              <ArrowsClockwise size={22} weight="bold" />
              都喜欢，先看下一组
            </button>
          </>
        ) : null}
      </div>

      <aside className="duel-sidebar">
        <label className="duel-signature">
          <span>海报署名</span>
          <input value={signature} maxLength={12} placeholder="比如：阿哲" onChange={(event) => setSignature(event.target.value)} />
        </label>
        <section className="duel-progress" aria-label="对决进度">
          <h2>对决进度</h2>
          <div>
            {[1, 2, 3, 4].map((round) => (
              <span key={round} className={state.round >= round ? 'is-complete' : ''}>
                <strong>R{round}</strong>
                <small>{round === 1 ? '1/8决赛' : round === 2 ? '1/4决赛' : round === 3 ? '半决赛' : '决赛'}</small>
              </span>
            ))}
          </div>
        </section>
        <section className="duel-poster-preview" aria-label="最终海报预览">
          <p>你的最终海报 <span>预览</span></p>
          <div>
            <span className="duel-poster-signature">{signature || '你的'}的</span>
            <h2>动漫冠军</h2>
            {previewWinner && <img className="duel-poster-winner" src={previewWinner.imageUrl} alt="" />}
            <strong>{previewWinner?.titleZh ?? '等待冠军'}</strong>
            <small>TOP 4</small>
            <div className="duel-top-four">
              {(topFour.length > 0 ? topFour : state.queue.slice(0, 4)).map((item, index) => (
                <span key={item.id}><b>{index + 1}</b><img src={item.imageUrl} alt="" /></span>
              ))}
            </div>
          </div>
        </section>
      </aside>

      <PosterModal imageUrl={imageUrl} downloadName="anime-champion.png" alt="动漫冠军分享海报" onClose={() => setImageUrl(null)} />
    </section>
  );
}
