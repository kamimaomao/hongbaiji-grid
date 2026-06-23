import type { GridSelection } from '../types';

interface GridProps {
  selection: GridSelection;
  onPickSlot: (slotIndex: number) => void;
}

export function Grid({ selection, onPickSlot }: GridProps) {
  return (
    <section className="grid-section" aria-label="红白机游戏九宫格">
      {selection.map((game, index) => (
        <button
          className={`grid-slot ${game ? 'is-filled' : ''}`}
          key={index}
          type="button"
          data-testid={`grid-slot-${index}`}
          aria-label={game ? `更换第 ${index + 1} 个红白机游戏：${game.titleZh}` : `选择第 ${index + 1} 个红白机游戏`}
          onClick={() => onPickSlot(index)}
        >
          {game ? (
            <>
              <span className="cover-frame" aria-hidden="true">
                <img className="cover-backdrop" src={game.imageUrl} alt="" />
                <img className="cover-art" src={game.imageUrl} alt="" />
              </span>
              <span className="grid-slot-title">{game.titleZh}</span>
            </>
          ) : (
            <span className="slot-plus">+</span>
          )}
        </button>
      ))}
    </section>
  );
}
