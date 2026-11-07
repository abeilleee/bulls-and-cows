import { createDomElement } from '@/utils/createDomElement';
import { rankResults } from '@/utils/rankResults';
import { formatDuration } from '@/utils/formatDuration';
import { LEADERBOARD_LIMIT } from '@/constants';
import type { GameResult } from '@/types';
import styles from './Leaderboard.module.css';
import { formatBase } from '@/utils/formatBase';

interface LeaderboardProps {
  results: GameResult[];
  limit?: number;
}

const COLUMNS = ['#', 'Settings', 'Attempts', 'Time', 'Date'] as const;

const formatDate = (achievedAt: number) => new Date(achievedAt).toLocaleDateString();

export function createLeaderboard({ results, limit = LEADERBOARD_LIMIT }: LeaderboardProps) {
  const container = createDomElement({
    classNames: [styles.container],
  });

  container.append(
    createDomElement({ tag: 'h2', classNames: [styles.title], textContent: 'Leaderboard' }),
  );

  const ranked = rankResults(results, limit);

  if (ranked.length === 0) {
    container.append(
      createDomElement({
        tag: 'p',
        classNames: [styles.empty],
        textContent: 'No records yet. Play your first game!',
      }),
    );

    return container;
  }

  const wrapper = createDomElement({
    classNames: [styles.wrapper],
    parentElement: container,
  });

  const table = createDomElement<HTMLTableElement>({
    tag: 'table',
    classNames: [styles.table],
    parentElement: wrapper,
  });

  const thead = createDomElement<HTMLTableSectionElement>({
    tag: 'thead',
    parentElement: table,
  });

  const headerRow = createDomElement<HTMLTableRowElement>({
    tag: 'tr',
    parentElement: thead,
  });

  COLUMNS.forEach((column) => {
    createDomElement<HTMLTableCellElement>({
      tag: 'th',
      classNames: [styles.heading],
      textContent: column,
      parentElement: headerRow,
      attributes: { scope: 'col' },
    });
  });

  const tbody = createDomElement<HTMLTableSectionElement>({
    tag: 'tbody',
    parentElement: table,
  });

  ranked.forEach((result, index) => {
    const row = createDomElement<HTMLTableRowElement>({
      tag: 'tr',
      parentElement: tbody,
    });

    createDomElement({
      tag: 'td',
      classNames: [styles.rank],
      textContent: String(index + 1),
      parentElement: row,
    });

    createDomElement({
      tag: 'td',
      parentElement: row,
      children: [
        createDomElement({
          tag: 'span',
          classNames: [styles.settings],
          textContent: `${result.settings.length} · ${formatBase(result.settings.base)}`,
        }),
      ],
    });

    createDomElement({
      tag: 'td',
      classNames: [styles.number],
      textContent: String(result.attempts),
      parentElement: row,
    });

    createDomElement({
      tag: 'td',
      classNames: [styles.number],
      textContent: formatDuration(result.durationMs),
      parentElement: row,
    });

    createDomElement({
      tag: 'td',
      classNames: [styles.date],
      textContent: formatDate(result.achievedAt),
      parentElement: row,
    });
  });

  return container;
}
