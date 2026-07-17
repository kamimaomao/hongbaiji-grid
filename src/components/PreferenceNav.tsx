export type ExperienceKey = 'music' | 'movie' | 'drama' | 'anime' | 'fc' | 'pc' | 'console' | 'boardgame';

interface PreferenceNavProps {
  active: ExperienceKey;
  onChange: (experience: ExperienceKey) => void;
}

const navItems: Array<{ key: ExperienceKey; label: string }> = [
  { key: 'music', label: '音乐' },
  { key: 'movie', label: '电影' },
  { key: 'drama', label: '剧集' },
  { key: 'anime', label: '动漫' },
  { key: 'fc', label: 'FC经典游戏' },
  { key: 'pc', label: 'PC游戏' },
  { key: 'console', label: '主机游戏' },
  { key: 'boardgame', label: '桌游' },
];

export function PreferenceNav({ active, onChange }: PreferenceNavProps) {
  return (
    <header className="preference-nav">
      <button className="preference-brand" type="button" onClick={() => onChange('music')} aria-label="偏爱首页">
        <span>偏爱</span>
        {active === 'anime' && <small>为每一种热爱<br />全力以赴</small>}
      </button>
      <nav aria-label="兴趣品类">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={active === item.key ? 'is-active' : ''}
            aria-current={active === item.key ? 'page' : undefined}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {active === 'anime' && (
        <div className="anime-mode-switch" aria-label="当前玩法">
          <span>九宫格</span>
          <span className="is-active">二选一</span>
          <span>排座次</span>
        </div>
      )}
    </header>
  );
}
