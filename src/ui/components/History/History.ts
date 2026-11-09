import { createDomElement } from '@/utils/createDomElement';
import { createBadge } from '@/ui/components/Badge';
import type { ElementOptions } from '@/ui/types';
import type { GuessEntry } from '@/types';
import styles from './History.module.css';

interface Props extends Pick<ElementOptions, 'parentElement'> {
  history: GuessEntry[];
}

export function createHistory({ history, parentElement }: Props) {
  const container = createDomElement({
    classNames: [styles.container],
    parentElement,
  });

  createDomElement({
    tag: 'h2',
    classNames: [styles.title],
    textContent: 'History',
    parentElement: container,
  });

  if (history.length === 0) {
    createDomElement({
      tag: 'p',
      classNames: [styles.empty],
      textContent: 'No guesses yet',
      parentElement: container,
    });
    return container;
  }

  const list = createDomElement({
    tag: 'ol',
    classNames: [styles.list],
    parentElement: container,
  });

  history.forEach((entry, index) => {
    const item = createDomElement({
      tag: 'li',
      classNames: [styles.item],
      parentElement: list,
    });

    createDomElement({
      tag: 'span',
      classNames: [styles.index],
      textContent: String(index + 1),
      parentElement: item,
    });

    createDomElement({
      tag: 'span',
      classNames: [styles.guess],
      textContent: entry.guess.toUpperCase(),
      parentElement: item,
    });

    createBadge({
      text: `Bulls: ${entry.bulls}`,
      parentElement: item,
    });

    createBadge({
      text: `Cows: ${entry.cows}`,
      variant: 'warning',
      parentElement: item,
    });
  });

  requestAnimationFrame(() => {
    list.scrollTop = list.scrollHeight;
  });

  return container;
}
