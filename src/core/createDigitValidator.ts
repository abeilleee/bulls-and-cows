import { getDigits } from '../utils/getDigits';
import type { Base } from './types';

/**
 * Curried digit validator factory.
 *
 * `createDigitValidator(base)` returns a predicate that checks whether
 * a single character is a valid digit in the given numeral system.
 *
 * For hex, case does not matter: 'a' and 'A' are the same digit.
 *
 * @param base - numeral system (2, 8, 10 or 16)
 * @returns predicate `(char) => boolean`
 */
export function createDigitValidator(base: Base): (char: string) => boolean {
  return (char) => {
    if (char.length !== 1) {
      return false;
    }

    const digits = getDigits(base);
    const index = digits.indexOf(char.toLowerCase());

    return index !== -1 && index < base;
  };
}
