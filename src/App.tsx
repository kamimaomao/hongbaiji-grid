import { useEffect, useState } from 'react';
import { AnimeDuel } from './components/AnimeDuel';
import { BoardgameExperience } from './components/BoardgameExperience';
import { ConsoleExperience } from './components/ConsoleExperience';
import { DramaExperience } from './components/DramaExperience';
import { FcExperience } from './components/FcExperience';
import { MovieExperience } from './components/MovieExperience';
import { MusicExperience } from './components/MusicExperience';
import { PcExperience } from './components/PcExperience';
import { PreferenceNav, type ExperienceKey } from './components/PreferenceNav';

const experienceKeys: ExperienceKey[] = ['music', 'movie', 'drama', 'anime', 'fc', 'pc', 'console', 'boardgame'];

const getInitialExperience = (): ExperienceKey => {
  const hash = window.location.hash.replace('#', '') as ExperienceKey;
  return experienceKeys.includes(hash) ? hash : 'music';
};

export default function App() {
  const [experience, setExperience] = useState<ExperienceKey>(getInitialExperience);

  useEffect(() => {
    const handleHashChange = () => setExperience(getInitialExperience());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeExperience = (next: ExperienceKey) => {
    setExperience(next);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${next}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className={`preference-app preference-${experience}`}>
      <PreferenceNav active={experience} onChange={changeExperience} />
      {experience === 'music' && <MusicExperience />}
      {experience === 'movie' && <MovieExperience />}
      {experience === 'drama' && <DramaExperience />}
      {experience === 'anime' && <AnimeDuel />}
      {experience === 'fc' && <FcExperience />}
      {experience === 'pc' && <PcExperience />}
      {experience === 'console' && <ConsoleExperience />}
      {experience === 'boardgame' && <BoardgameExperience />}
    </main>
  );
}
