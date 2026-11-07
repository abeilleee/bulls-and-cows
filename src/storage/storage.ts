import { rankResults } from '@/utils/rankResults';
import { AVAILABLE_LENGTHS, LEADERBOARD_LIMIT } from '@/constants';
import type { AvailableLength, GameResult } from '@/types';
import { Base } from '@/core/types';

const STORAGE_KEY = 'abeilleee:bulls-and-cows';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBase = (value: unknown): value is Base =>
  typeof value === 'number' && Object.values(Base).includes(value as Base);

const isLength = (value: unknown): value is AvailableLength =>
  typeof value === 'number' && AVAILABLE_LENGTHS.some((length) => length === value);

const normalizeResult = (value: unknown): GameResult | null => {
  if (!isRecord(value) || !isRecord(value.settings)) {
    return null;
  }

  const { achievedAt, attempts, durationMs } = value;
  const { base, length } = value.settings;

  if (
    typeof achievedAt !== 'number' ||
    !Number.isFinite(achievedAt) ||
    typeof attempts !== 'number' ||
    !Number.isInteger(attempts) ||
    attempts < 1 ||
    typeof durationMs !== 'number' ||
    !Number.isFinite(durationMs) ||
    durationMs < 0 ||
    !isBase(base) ||
    !isLength(length)
  ) {
    return null;
  }

  return {
    achievedAt,
    attempts,
    durationMs,
    settings: { base, length },
  };
};

export const loadResults = (): GameResult[] => {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeResult).filter((result): result is GameResult => result !== null);
  } catch {
    return [];
  }
};

export const saveResults = (results: readonly GameResult[]) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    return;
  }
};

export const saveResult = (result: GameResult) => {
  const results = rankResults([...loadResults(), result], LEADERBOARD_LIMIT);

  saveResults(results);
};
