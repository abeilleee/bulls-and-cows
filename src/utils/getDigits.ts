import type { Base } from '../core/types';

/**
 * Full digit alphabet in lowercase, ordered by value:
 * `'0'..'9'`, then `'a'..'f'`.
 *
 * Covers every supported base (2, 8, 10, 16).
 */
export const DIGITS = '0123456789abcdef';

/**
 * Returns the digit alphabet for the given numeral system base
 * as a string of single-character digits, in lowercase.
 *
 * `getDigits(Base.bin)`  → `'01'`
 * `getDigits(Base.oct)`  → `'01234567'`
 * `getDigits(Base.dec)`  → `'0123456789'`
 * `getDigits(Base.hex)`  → `'0123456789abcdef'`
 *
 * @throws if `base` is greater than the available alphabet length
 */
export const getDigits = (base: Base): string => {
  if (base > DIGITS.length) {
    throw new Error(`base (${base}) exceeds available alphabet length (${DIGITS.length})`);
  }

  return DIGITS.slice(0, base);
};
