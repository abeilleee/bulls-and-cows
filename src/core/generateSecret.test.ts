import { generateSecret } from './generateSecret';
import { Base } from './types';

const secretCases: Array<[Base, number, RegExp]> = [
  [Base.bin, 2, /^[01]+$/],
  [Base.oct, 6, /^[0-7]+$/],
  [Base.dec, 6, /^[0-9]+$/],
  [Base.hex, 6, /^[0-9a-f]+$/],
];

describe('generateSecret', () => {
  it('returns a string of the requested length', () => {
    const secret = generateSecret(4, Base.dec, () => 0.5);

    expect(typeof secret).toBe('string');
    expect(secret).toHaveLength(4);
  });

  it('allows a secret to start with zero', () => {
    const secret = generateSecret(4, Base.dec, () => 0);

    expect(secret[0]).toBe('0');
  });

  it.each(secretCases)(
    'generates a base-%i secret of length %i with unique valid digits',
    (base, length, reg) => {
      const secret = generateSecret(length, base, () => 0.42);

      expect(secret).toHaveLength(length);
      expect(new Set(secret).size).toBe(length);
      expect(reg.test(secret)).toBe(true);
    },
  );

  it('is deterministic for a fixed random source', () => {
    const makeRandom = () => {
      const values = [0.1, 0.3, 0.5, 0.7];
      let i = 0;

      return () => values[i++ % values.length];
    };

    const a = generateSecret(4, Base.dec, makeRandom());
    const b = generateSecret(4, Base.dec, makeRandom());

    expect(a).toBe(b);
  });

  it('calls the provided random source', () => {
    const random = vi.fn(() => 0.5);

    generateSecret(4, Base.dec, random);
    expect(random).toHaveBeenCalled();
  });

  it('falls back to Math.random when random is omitted', () => {
    const secret = generateSecret(4, Base.dec);

    expect(secret).toHaveLength(4);
    expect(new Set(secret).size).toBe(4);
  });

  it('throws when length is greater than base', () => {
    expect(() => generateSecret(11, Base.dec)).toThrow();
  });

  it('throws when length is less than 1', () => {
    expect(() => generateSecret(0, Base.dec)).toThrow();
  });

  it('throws when length is negative', () => {
    expect(() => generateSecret(-1, Base.dec)).toThrow();
  });
});
