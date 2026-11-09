import { evaluateGuess } from './evaluateGuess';

describe('evaluateGuess', () => {
  it('counts all digits as bulls when the guess equals the secret', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns zero bulls and zero cows when no digits match', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('counts only bulls when matching digits are in place', () => {
    expect(evaluateGuess('1234', '1256')).toEqual({ bulls: 2, cows: 0 });
  });

  it('counts only cows when all matched digits are out of place', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows separately for the same digits', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
  });

  it('does not count bulls as cows', () => {
    expect(evaluateGuess('1234', '2314')).toEqual({ bulls: 1, cows: 3 });
  });

  it('supports secrets with a leading zero', () => {
    expect(evaluateGuess('0123', '3012')).toEqual({ bulls: 0, cows: 4 });
  });

  it('returns zero for empty strings', () => {
    expect(evaluateGuess('', '')).toEqual({ bulls: 0, cows: 0 });
  });

  it('compares hex digits case-insensitively', () => {
    expect(evaluateGuess('abcd', 'ABCD')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('aBcD', 'dCbA')).toEqual({ bulls: 0, cows: 4 });
  });
});
