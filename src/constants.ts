import { Base } from './core/types';

export const AVAILABLE_LENGTHS = [2, 3, 4, 5, 6] as const;
export const LEADERBOARD_LIMIT = 10;

export const BASE_LABEL_ENTRIES: ReadonlyArray<readonly [Base, string]> = [
  [Base.bin, 'BIN'],
  [Base.oct, 'OCT'],
  [Base.dec, 'DEC'],
  [Base.hex, 'HEX'],
] as const;

export const BASE_LABELS: Record<Base, string> = Object.fromEntries(BASE_LABEL_ENTRIES) as Record<
  Base,
  string
>;
