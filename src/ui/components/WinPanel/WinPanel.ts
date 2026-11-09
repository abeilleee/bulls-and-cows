import { createDomElement } from '@/utils/createDomElement';
import { formatDuration } from '@/utils/formatDuration';
import { createButton } from '@/ui/components/Button';
import type { WonState } from '@/types';
import styles from './WinPanel.module.css';

interface Props {
  state: WonState;
  onNewGame: () => void;
}

export function createWinPanel({ state, onNewGame }: Props) {
  const container = createDomElement({
    classNames: [styles.win],
    attributes: { role: 'status', 'aria-live': 'polite' },
  });

  createDomElement({
    tag: 'h2',
    classNames: [styles.title],
    textContent: 'You won!',
    parentElement: container,
  });

  createDomElement({
    classNames: [styles.secret],
    parentElement: container,
    children: [
      createDomElement({ tag: 'span', textContent: 'The secret was ' }),
      createDomElement({
        tag: 'strong',
        classNames: [styles['secret-value']],
        textContent: state.secret.toUpperCase(),
      }),
    ],
  });

  createDomElement({
    tag: 'p',
    textContent: `Solved in ${state.history.length} attempts · ${formatDuration(state.finishedAt - state.startedAt)}`,
    parentElement: container,
  });

  const actions = createDomElement({
    classNames: [styles.actions],
    parentElement: container,
  });

  createButton({
    textContent: 'New game',
    onClick: onNewGame,
    parentElement: actions,
  });

  return container;
}
