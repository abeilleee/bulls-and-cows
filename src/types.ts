import type { AVAILABLE_LENGTHS } from './constants';
import type { Base } from './core/types';

export interface GameSettings {
  base: Base;
  length: AvailableLength;
}

export type AvailableLength = (typeof AVAILABLE_LENGTHS)[number];
