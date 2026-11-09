import { createDomElement } from '@/utils/createDomElement';
import { formatDuration } from '@/utils/formatDuration';
import { createButton } from '@/ui/components/Button';
import { createGameInput } from '@/ui/components/GameInput';
import { createSettingsSummary } from '@/ui/components/SettingsSummary';
import { createWinPanel } from '@/ui/components/WinPanel';
import { createBadge } from '@/ui/components/Badge';
import { createHistory } from '@/ui/components/History';
import { GamePhase, type PlayingState, type WonState } from '@/types';
import styles from './GameScreen.module.css';

interface Props {
  state: PlayingState | WonState;
  onSubmit: (guess: string) => string | null;
  onNewGame: () => void;
}

export interface GameScreen {
  element: HTMLElement;
  destroy: () => void;
}

export function createGameScreen({ state, onSubmit, onNewGame }: Props): GameScreen {
  const container = createDomElement({
    classNames: [styles.container],
  });

  const header = createDomElement({
    classNames: [styles.header],
    parentElement: container,
  });

  const summary = createDomElement({
    classNames: [styles.summary],
    parentElement: header,
  });

  createSettingsSummary({
    settings: state.settings,
    parentElement: summary,
  });

  const stats = createDomElement({
    classNames: [styles.stats],
    parentElement: summary,
  });

  createDomElement({
    tag: 'p',
    classNames: [styles.stat],
    textContent: `Attempts: ${state.history.length}`,
    parentElement: stats,
  });

  const timer = createDomElement({
    tag: 'p',
    classNames: [styles.stat],
    parentElement: stats,
  });

  const getElapsed = () => {
    if (state.phase === GamePhase.Won) {
      return state.finishedAt - state.startedAt;
    }
    return Date.now() - state.startedAt;
  };

  const updateTimer = () => {
    timer.textContent = `Time: ${formatDuration(getElapsed())}`;
  };

  updateTimer();

  let timerId: number | undefined;

  if (state.phase === GamePhase.Playing) {
    timerId = window.setInterval(updateTimer, 1000);

    container.append(
      createGameInput({
        length: state.settings.length,
        base: state.settings.base,
        onSubmit,
      }),
    );

    createButton({
      textContent: 'New game',
      onClick: onNewGame,
      classNames: [styles.action],
      parentElement: header,
    });
  } else {
    container.append(
      createWinPanel({
        state,
        onNewGame,
      }),
    );
  }

  const legend = createDomElement({
    classNames: [styles.legend],
    parentElement: container,
  });

  createBadge({
    text: 'Bulls: correct digit and position',
    parentElement: legend,
  });

  createBadge({
    text: 'Cows: correct digit, wrong position',
    variant: 'warning',
    parentElement: legend,
  });

  container.append(
    createHistory({
      history: state.history,
    }),
  );

  const destroy = () => {
    if (timerId !== undefined) {
      window.clearInterval(timerId);
    }
  };

  return { element: container, destroy };
}
