import type { GameResult, GameSettings } from '@/types';
import { createLeaderboard } from '@/ui/components/Leaderboard';
import { createSettingsPanel } from '@/ui/components/SettingsPanel';
import { createDomElement } from '@/utils/createDomElement';
import styles from './StartScreen.module.css';

interface Props {
  initialSettings: GameSettings;
  onStart: (settings: GameSettings) => void;
  results?: GameResult[];
}

export function createStartScreen({ initialSettings, onStart, results = [] }: Props) {
  return createDomElement({
    classNames: [styles.container],
    children: [createSettingsPanel({ initialSettings, onStart }), createLeaderboard({ results })],
  });
}
