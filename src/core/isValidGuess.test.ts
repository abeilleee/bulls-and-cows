import { isValidGuess } from './isValidGuess';
import { Base } from './types';

const validCases: Array<[string, number, Base]> = [
  ['01', 2, Base.bin],
  ['10', 2, Base.bin],
  ['0123', 4, Base.oct],
  ['76543210', 8, Base.oct],
  ['0123', 4, Base.dec],
  ['0123456789', 10, Base.dec],
  ['aF09', 4, Base.hex],
  ['ABCD', 4, Base.hex],
  ['0123456789abcdef', 16, Base.hex],
];

const wrongLengthCases: Array<[string, number, Base]> = [
  ['', 2, Base.dec],
  ['1', 2, Base.dec],
  ['12', 3, Base.dec],
  ['1234', 3, Base.dec],
  ['010', 2, Base.bin],
];

const invalidDigitCases: Array<[string, number, Base]> = [
  ['02', 2, Base.bin],
  ['2', 1, Base.bin],
  ['9', 1, Base.oct],
  ['8', 1, Base.oct],
  ['a', 1, Base.dec],
  ['A', 1, Base.dec],
  ['g', 1, Base.hex],
  ['G', 1, Base.hex],
  [' ', 1, Base.dec],
  ['\t', 1, Base.dec],
  ['\n', 1, Base.dec],
  ['.', 1, Base.dec],
  ['-', 1, Base.dec],
  ['+', 1, Base.dec],
  ['1.2', 3, Base.dec],
  ['12 3', 4, Base.dec],
];

const duplicateCases: Array<[string, number, Base]> = [
  ['11', 2, Base.dec],
  ['1100', 4, Base.dec],
  ['00', 2, Base.bin],
  ['aA', 2, Base.hex],
  ['Aaa', 3, Base.hex],
  ['fF1', 3, Base.hex],
];

describe('isValidGuess', () => {
  it.each(validCases)('accepts %j for length %i in base %i', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(true);
  });

  it.each(wrongLengthCases)('rejects %j when length is %i in base %i', (guess, length, base) => {
    expect(isValidGuess(guess, length, base)).toBe(false);
  });

  it.each(invalidDigitCases)(
    'rejects %j as an invalid digit for length %i in base %i',
    (guess, length, base) => {
      expect(isValidGuess(guess, length, base)).toBe(false);
    },
  );

  it.each(duplicateCases)(
    'rejects %j with repeated digits for length %i in base %i',
    (guess, length, base) => {
      expect(isValidGuess(guess, length, base)).toBe(false);
    },
  );

  it('treats hex digits case-insensitively as the same digit', () => {
    expect(isValidGuess('aB', 2, Base.hex)).toBe(true);
    expect(isValidGuess('aA', 2, Base.hex)).toBe(false);
    expect(isValidGuess('Aaa', 3, Base.hex)).toBe(false);
  });

  it('accepts uppercase hex digits', () => {
    expect(isValidGuess('ABCDEF', 6, Base.hex)).toBe(true);
  });
});
