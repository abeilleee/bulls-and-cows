import type { AVAILABLE_LENGTHS } from './constants';
import type { Base } from './core/types';

export interface GameSettings {
  base: Base;
  length: AvailableLength;
}

export interface GameResult {
  achievedAt: number;
  attempts: number;
  durationMs: number;
  settings: GameSettings;
}

export type AvailableLength = (typeof AVAILABLE_LENGTHS)[number];
