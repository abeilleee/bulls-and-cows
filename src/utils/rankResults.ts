interface Rankable {
  attempts: number;
  durationMs: number;
  achievedAt: number;
}

export const rankResults = <T extends Rankable>(results: readonly T[], limit: number): T[] =>
  [...results]
    .sort(
      (a, b) =>
        a.attempts - b.attempts || a.durationMs - b.durationMs || a.achievedAt - b.achievedAt,
    )
    .slice(0, limit);
