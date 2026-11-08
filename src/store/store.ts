import { evaluateGuess } from '@/core/evaluateGuess';
import { generateSecret } from '@/core/generateSecret';
import { isValidGuess } from '@/core/isValidGuess';
import { Base } from '@/core/types';
import { saveResult } from '@/storage/storage';
import {
  GamePhase,
  type GameResult,
  type GameSettings,
  type GameState,
  type GuessEntry,
  type PlayingState,
} from '@/types';
import { getDigits } from '@/utils/getDigits';

export interface Store {
  getState: () => GameState;
  subscribe: (listener: (state: GameState) => void) => () => void;
  startGame: (settings: GameSettings) => void;
  submitGuess: (guess: string) => string | null;
  resetGame: () => void;
}

const initialSettings: GameSettings = {
  base: Base.dec,
  length: 4,
};

function createStore(settings: GameSettings): Store {
  let state: GameState = {
    phase: GamePhase.Settings,
    settings,
  };

  const listeners = new Set<(state: GameState) => void>();

  const createPlayingState = (settings: GameSettings): PlayingState => ({
    phase: GamePhase.Playing,
    settings,
    secret: generateSecret(settings.length, settings.base),
    history: [],
    startedAt: Date.now(),
  });

  const setState = (next: GameState) => {
    state = next;
    listeners.forEach((listener) => listener(state));
  };

  return {
    getState: () => state,

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    startGame: (nextSettings) => {
      if (state.phase !== GamePhase.Settings) {
        return;
      }

      setState(createPlayingState(nextSettings));
    },

    submitGuess: (guess) => {
      if (state.phase !== GamePhase.Playing) {
        return null;
      }

      if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
        return `"${guess.toUpperCase()}" is invalid. Enter ${state.settings.length} unique digits from "${getDigits(state.settings.base)}"`;
      }

      const normalizedGuess = guess.toLowerCase();

      if (state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess)) {
        return 'This guess has already been tried';
      }

      const result = evaluateGuess(state.secret, guess);
      const entry: GuessEntry = { guess, ...result };
      const history = [...state.history, entry];
      const won = result.bulls === state.settings.length;

      if (won) {
        const finishedAt = Date.now();
        const gameResult: GameResult = {
          achievedAt: finishedAt,
          attempts: history.length,
          durationMs: finishedAt - state.startedAt,
          settings: state.settings,
        };

        saveResult(gameResult);

        setState({
          ...state,
          phase: GamePhase.Won,
          history,
          finishedAt,
        });
      } else {
        setState({ ...state, history });
      }

      return null;
    },

    resetGame: () => {
      setState({
        phase: GamePhase.Settings,
        settings: state.settings,
      });
    },
  };
}

export const store = createStore(initialSettings);
