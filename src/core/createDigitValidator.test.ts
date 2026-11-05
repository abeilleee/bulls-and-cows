import { createDigitValidator } from './createDigitValidator';
import { Base } from './types';

const acceptedCases: Array<[string, Base]> = [
  ['0', Base.bin],
  ['1', Base.bin],
  ['0', Base.oct],
  ['7', Base.oct],
  ['0', Base.dec],
  ['9', Base.dec],
  ['0', Base.hex],
  ['9', Base.hex],
  ['a', Base.hex],
  ['f', Base.hex],
  ['A', Base.hex],
  ['F', Base.hex],
];

const rejectedCases: Array<[string, Base]> = [
  ['2', Base.bin],
  ['8', Base.bin],
  ['a', Base.bin],
  ['8', Base.oct],
  ['9', Base.oct],
  ['a', Base.dec],
  ['f', Base.dec],
  ['g', Base.hex],
  ['G', Base.hex],
  ['z', Base.hex],
];

const nonDigitCases: Array<[string, Base]> = [
  [' ', Base.dec],
  ['\t', Base.dec],
  ['\n', Base.dec],
  ['.', Base.dec],
  [',', Base.dec],
  ['-', Base.dec],
  ['+', Base.dec],
  ['!', Base.dec],
  ['@', Base.hex],
  ['#', Base.hex],
];

describe('createDigitValidator', () => {
  it('returns function', () => {
    expect(typeof createDigitValidator(Base.dec)).toBe('function');
  });

  it.each(acceptedCases)('accepts %s for base %s', (char, base) => {
    expect(createDigitValidator(base)(char)).toBe(true);
  });

  it.each(rejectedCases)('rejects %s for base %s', (char, base) => {
    expect(createDigitValidator(base)(char)).toBe(false);
  });

  it.each(nonDigitCases)('rejects non-digit %j for base %s', (char, base) => {
    expect(createDigitValidator(base)(char)).toBe(false);
  });

  it('rejects empty string regardless of base', () => {
    expect(createDigitValidator(Base.dec)('')).toBe(false);
  });

  it('rejects string if length !== 1', () => {
    expect(createDigitValidator(Base.bin)('123')).toBe(false);
  });

  it('returns independent predicates for different bases', () => {
    const isBinary = createDigitValidator(Base.bin);
    const isHex = createDigitValidator(Base.hex);

    expect(isBinary('2')).toBe(false);
    expect(isHex('2')).toBe(true);
    expect(isBinary('f')).toBe(false);
    expect(isHex('f')).toBe(true);
  });
});
