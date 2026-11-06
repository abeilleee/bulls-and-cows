import { createDigitValidator } from './createDigitValidator';
import type { Base } from './types';

/**
 * Checks whether `guess` is a valid attempt for a game with the given
 * `length` and numeral system `base`.
 *
 * A guess is valid when **all** of the following hold:
 *   1. its length equals `length`;
 *   2. every character is a valid digit for `base` (hex digits are case-insensitive: `a` and `A` are the same digit);
 *   3. its digits are unique — no digit is repeated.
 *
 * @param guess — the player's attempt (e.g. `'0123'`, `'aBcD'`)
 * @param length — expected number of digits (2–6 in this game)
 * @param base — numeral system base (`Base.bin | Base.oct | Base.dec | Base.hex`)
 * @returns `true` if the guess is valid, `false` otherwise
 */
export function isValidGuess(guess: string, length: number, base: Base) {
  if (guess.length !== length) {
    return false;
  }

  const digits = guess.toLowerCase().split('');
  const isDigit = createDigitValidator(base);

  return digits.every(isDigit) && new Set(digits).size === length;
}
