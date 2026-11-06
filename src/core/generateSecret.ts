import type { Base } from './types';

export function generateSecret(length: number, base: Base, random = Math.random): string {
  void length;
  void base;
  void random;

  throw new Error('Not implemented');
}
