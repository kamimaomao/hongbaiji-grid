import type { GridSelection } from '../types';

interface GridProps {
  selection: GridSelection;
  gridLabel: string;
  slotItemLabel: string;
  onPickSlot: (slotIndex: number) => void;
}

export function Grid({ selection, gridLabel, slotItemLabel, onPickSlot }: GridProps) {
  return (
    <section className="grid-section" aria-label={gridLabel}>
      {selection.map((game, index) => (
        <button
          className={`grid-slot ${game ? 'is-filled' : ''}`}
          key={index}
          type="button"
          data-testid={`grid-slot-${index}`}
          aria-label={game ? `更换第 ${index + 1} 个${slotItemLabel}：${game.titleZh}` : `选择第 ${index + 1} 个${slotItemLabel}`}
          onClick={() => onPickSlot(index)}
        >
          {game ? (
            <>
              <span className="cover-frame" aria-hidden="true">
                <img className="cover-backdrop" src={game.imageUrl} alt="" loading="lazy" decoding="async" />
                <img className="cover-art" src={game.imageUrl} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="grid-slot-title">{game.titleZh}</span>
            </>
          ) : (
            <>
              <span className="slot-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="slot-plus">+</span>
            </>
          )}
        </button>
      ))}
    </section>
  );
}
