import type { GuessEvaluation } from './types';

const toDigits = (value: string): string[] => value.toLowerCase().split('');

/**
 * Compares a guess against the secret and returns the number of bulls and cows.
 *
 * @param secret - string
 * @param guess - string
 * @returns GuessEvaluation -> `{ bulls, cows }`
 */
export function evaluateGuess(secret: string, guess: string): GuessEvaluation {
  const secretDigits = toDigits(secret);
  const guessDigits = toDigits(guess);
  const bulls = secretDigits.filter((digit, idx) => guessDigits[idx] === digit).length;
  const nonBullSecret = secretDigits.filter((digit, idx) => guessDigits[idx] !== digit);
  const nonBullGuess = guessDigits.filter((digit, idx) => secretDigits[idx] !== digit);

  const cows = nonBullGuess.reduce(
    (acc, digit) => {
      const index = acc.remaining.indexOf(digit);

      if (index === -1) {
        return acc;
      }

      return {
        cowsCount: acc.cowsCount + 1,
        remaining: [...acc.remaining.slice(0, index), ...acc.remaining.slice(index + 1)],
      };
    },
    { cowsCount: 0, remaining: nonBullSecret },
  ).cowsCount;

  return { bulls, cows };
}
