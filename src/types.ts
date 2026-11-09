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

export interface GuessEntry {
  guess: string;
  bulls: number;
  cows: number;
}

export interface SettingsState {
  phase: GamePhase.Settings;
  settings: GameSettings;
}

export interface PlayingState {
  phase: GamePhase.Playing;
  settings: GameSettings;
  secret: string;
  history: GuessEntry[];
  startedAt: number;
}

export interface WonState {
  phase: GamePhase.Won;
  settings: GameSettings;
  secret: string;
  history: GuessEntry[];
  startedAt: number;
  finishedAt: number;
}

export type AvailableLength = (typeof AVAILABLE_LENGTHS)[number];
export type GameState = SettingsState | PlayingState | WonState;

export enum GamePhase {
  Settings,
  Playing,
  Won,
}
