import type { Base } from './types';

/** Memo cache: key - "length:base". */
const cache = new Map<string, number>();

/**
 * Counts the number of permutations for the given length and base.
 * Recursive and memoized.
 */
export function countPossibleSecrets(length: number, base: Base): number {
  if (length < 0 || length > base) {
    return 0;
  }

  if (length === 0) {
    return 1;
  }

  const key = [length, base].join(':');
  const cached = cache.get(key);

  if (cached !== undefined) {
    return cached;
  }

  const result = base * countPossibleSecrets(length - 1, base - 1);
  cache.set(key, result);

  return result;
}
