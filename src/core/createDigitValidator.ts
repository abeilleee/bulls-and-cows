import type { Base } from './types';

export function createDigitValidator(base: Base): (char: string) => boolean {
  void base;
  throw new Error('Not implemented');
}
