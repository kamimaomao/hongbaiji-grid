import type { CollectionVariant, GridSelection } from '../types';

interface ThemedGridProps {
  selection: GridSelection;
  variant: 'music' | 'drama' | CollectionVariant;
  itemLabel: string;
  onPickSlot: (slotIndex: number) => void;
}

export function ThemedGrid({ selection, variant, itemLabel, onPickSlot }: ThemedGridProps) {
  return (
    <div className={`themed-grid themed-grid-${variant}`} aria-label={`${itemLabel}九宫格`}>
      {selection.map((item, index) => (
        <button
          className={`themed-grid-slot ${item ? 'is-filled' : ''}`}
          key={index}
          type="button"
          aria-label={item ? `更换第 ${index + 1} 个${itemLabel}：${item.titleZh}` : `选择第 ${index + 1} 个${itemLabel}`}
          onClick={() => onPickSlot(index)}
        >
          {item ? (
            <>
              <img src={item.imageUrl} alt="" loading={index > 5 ? 'lazy' : 'eager'} />
              <span className="themed-grid-title">
                <strong>{item.titleZh}</strong>
                {variant !== 'music' && <small>{item.titleOriginal}</small>}
              </span>
            </>
          ) : (
            <>
              <span className="themed-grid-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="themed-grid-plus" aria-hidden="true">+</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}
