import { getDigits } from '../utils/getDigits';
import { Base } from './types';

/**
 * Generates a secret — a string of `length` unique digits in the numeral system `base`.
 *
 * @param length — number of digits in the secret (1 ≤ length ≤ base)
 * @param base — numeral system base (`Base.bin | Base.oct | Base.dec | Base.hex`)
 * @param random — randomness source returning a number in `[0, 1)`
 * @returns string of `length` unique digits valid for `base`
 * @throws if `length < 1` or `length > base`
 */
export function generateSecret(length: number, base: Base, random: () => number = Math.random) {
  if (length > base) {
    throw new Error('Length must be <= base');
  }

  if (length < 1) {
    throw new Error('Length must be >= 1');
  }

  const pick = (pool: string[], remaining: number): string[] => {
    if (remaining === 0) {
      return [];
    }

    const index = Math.min(Math.floor(random() * pool.length), pool.length - 1);
    const chosen = pool[index];
    const rest = [...pool.slice(0, index), ...pool.slice(index + 1)];

    return [chosen, ...pick(rest, remaining - 1)];
  };

  return pick([...getDigits(base)], length).join('');
}
