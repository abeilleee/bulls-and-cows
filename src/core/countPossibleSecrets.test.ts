import { countPossibleSecrets } from './countPossibleSecrets';
import { Base } from './types';

const permutationCases: Array<[number, Base, number]> = [
  [0, Base.bin, 1],
  [1, Base.bin, 2],
  [2, Base.bin, 2],
  [2, Base.oct, 56],
  [8, Base.oct, 40320],
  [2, Base.dec, 90],
  [4, Base.dec, 5040],
  [10, Base.dec, 3628800],
  [2, Base.hex, 240],
  [4, Base.hex, 43680],
  [6, Base.hex, 5765760],
];

describe('countPossibleSecrets', () => {
  it.each(permutationCases)('returns P(%i, %i) = %i distinct secrets', (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  it.each([
    [3, Base.bin],
    [9, Base.oct],
    [11, Base.dec],
    [17, Base.hex],
  ])('returns 0 when length > base: length=%i, base=%i', (length, base) => {
    expect(countPossibleSecrets(length, base)).toBe(0);
  });

  it('returns 0 when length is a negative number', () => {
    expect(countPossibleSecrets(-3, Base.bin)).toBe(0);
  });

  it('returns 1 when length === 0', () => {
    expect(countPossibleSecrets(0, Base.oct)).toBe(1);
  });

  it('returns the same result for identical arguments', () => {
    expect(countPossibleSecrets(7, Base.hex)).toBe(countPossibleSecrets(7, Base.hex));
  });
});
