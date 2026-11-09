# Architecture & Design Document

This document describes the architectural decisions, data structures, algorithms, and clean code principles applied in the **Bulls and Cows** project.

## 1. Data Structures and Algorithms

### Game State and History (The Store)

The state is represented as an **immutable discriminated union** (`GameState`), transitioning through three phases:

1. `SettingsState`: The initial state where the user configures the game (`settings` object).
2. `PlayingState`: The active game. Contains the `secret` string, `startedAt` timestamp, and the `history` array.
3. `WonState`: The finished game. Contains the final `history` and `finishedAt` timestamp.

**Why this structure?**

- **Immutability:** Every state update (e.g., `submitGuess`) creates a new state object using the spread operator (`{ ...state, history: [...state.history, entry] }`). We never mutate the existing state or use `push()`.
- **Type Safety:** Using a discriminated union (keyed by `phase`) allows TypeScript to narrow types. For example, the `secret` property only exists in `PlayingState` and `WonState`, preventing accidental access on the settings screen.
- **History:** The guess history is a `GuessEntry[]` (`{ guess: string, bulls: number, cows: number }`). Storing the evaluation alongside the guess allows the UI to render the history without recalculating past results.

### `evaluateGuess(secret, guess)` Algorithm

The function evaluates a guess using **Higher-Order Functions (HOF)** instead of manual loops with counters.

1. **Normalization:** Both strings are converted to arrays of lowercase characters (to make hex digits case-insensitive).
2. **Bulls:** We use `.filter()` to compare the secret and guess character by character. If the characters at the same index match, it's a bull.
3. **Cows:** A digit can only be counted once, and a bull cannot also be a cow.
   - We filter out the bulls from both the secret and the guess (`nonBullSecret`, `nonBullGuess`).
   - We use `.reduce()` over the remaining guess digits. The accumulator holds `{ cowsCount, remaining }`.
   - For each digit, we check if it exists in `acc.remaining`. If it does, we increment the cow count and **immutably remove** that digit from `acc.remaining` (using `.slice()` and spread). This guarantees that a digit appearing once in the secret cannot be matched twice.

### `countPossibleSecrets(length, base)` Algorithm

This function calculates the number of permutations P(base, length) = base! / (base - length)!.

- **Recursion:** It is implemented recursively based on the formula: `countPossibleSecrets(length, base) = base * countPossibleSecrets(length - 1, base - 1)`. The base cases handle `length === 0` (returns 1) and invalid inputs (`length < 0 || length > base`, returns 0).
- **Memoization:** Since the settings screen might call this function multiple times with the same arguments, the results are cached in a `Map`. The cache key is a string combination of `${length}:${base}`.

---

## 2. Complexity (Big O)

In the complexity analysis below:

- **`n`** — the length of the secret (from 2 to 6).
- **`k`** — the base of the numeral system (alphabet size: 2, 8, 10, or 16).

| Function                   | Time Complexity | Justification                                                                                                                                                                                                                            |
| :------------------------- | :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`generateSecret`**       | **O(n × k)**    | On each of the `n` steps, we create a new array by copying up to `k` remaining digits (`slice` + spread). Since `k` is a small constant (max 16), this is effectively **O(n)**.                                                          |
| **`evaluateGuess`**        | **O(n)**        | We perform a constant number of passes over arrays of length `n` (`filter` for bulls, `filter` for non-bulls, `reduce` for cows).                                                                                                        |
| **`isValidGuess`**         | **O(n × k)**    | Each of the n characters is checked by a predicate that re-runs getDigits(base) (O(k)) and indexOf (O(k)), so character validation is O(n × k); the uniqueness Set adds O(n). Since k ≤ 16, this is effectively O(n).                    |
| **`countPossibleSecrets`** | **O(n)**        | Thanks to memoization, the function computes at most `n` distinct states (one for each length from `0` to `n`). Each state requires `O(1)` multiplication. _(Without memoization, it would be O(2^n) due to the binary recursion tree)._ |

---

## 3. Clean Code Principles

### 3.1. Functions: Small, Focused, and Self-Documenting

- **Single Responsibility:** Each function does exactly one thing. For example, `src/ui/components/History/History.ts` only renders the guess list, while `src/ui/components/WinPanel/WinPanel.ts` only renders the victory panel. `GameScreen.ts` acts purely as a coordinator, calling these blocks without mixing rendering logic.
- **JSDoc for Public Contracts:** Core functions have JSDoc comments explaining their contract, parameters, and return values (e.g., `evaluateGuess`, `generateSecret`, `isValidGuess`). This serves as built-in documentation visible directly in the IDE.

### 3.2. SOLID Principle: Single Responsibility for the Store

The store (`src/store/store.ts`) follows the **Single Responsibility Principle**. It is the _only_ place where game state lives and transitions happen. The UI (`src/ui/`) has no idea how the game works; it just calls methods like `store.submitGuess()` and re-renders when the store notifies it via the Observer pattern.

### 3.3. Core Principles: DRY, KISS

- **DRY:**
  - _How:_ The `AVAILABLE_LENGTHS` array (`[2, 3, 4, 5, 6]`) is the single source of truth for allowed lengths. It is used both in the UI (to render radio buttons) and in the storage.
  - _Where:_ `src/constants.ts`, `src/ui/components/SettingsPanel/SettingsPanel.ts` and `src/storage/storage.ts`.
  - _How:_ Similarly, the `Base` enum is defined once and reused across settings, validation, and secret generation, preventing magic numbers (`10`, `16`) from spreading across the codebase.
  - _Where:_ `src/core/isValidGuess.ts` and `src/store/store.ts`.

- **KISS:**
  - _Where:_ `src/store/store.ts`.
  - _How:_ State management is implemented as a simple closure with a `Set` of listeners. Instead of pulling in a heavy library (Redux, Zustand) or writing a complex class hierarchy, we use a plain object with `getState`, `subscribe`, and actions.

### 3.4. Immutability and Side Effects

- **Immutable State:** State updates in `src/store/store.ts` always create new objects (`{ ...state, history: [...state.history, entry] }`). We never mutate arrays with `push()` or objects directly.
- **Isolated Side Effects:** Pure functions in `src/core/` have no side effects. Side effects (like `localStorage` access or DOM manipulation) are pushed to the boundaries of the app (`src/storage/` and `src/ui/`).

### 3.5. Testability & Dependency Injection

- **Pure Functions Where Possible:** The entire `src/core/` directory consists of pure functions, making them trivial to test without a browser.
- **Dependency Injection:** `generateSecret(length, base, random = Math.random)` accepts the randomness source as an argument. This decouples the logic from `Math.random` and allows tests to pass a deterministic function to predict the output.
- **Separation of Logic and Side Effects:** The game logic doesn't know about the DOM or `localStorage`. It only computes values, which makes unit testing fast and reliable.

### 3.6. TypeScript Safety (No `any` Masking)

- **No explicit or implicit `any`:** The project is written with strict TypeScript settings. `unknown` is used for external data, followed by **type guards** (e.g., `src/storage/storage.ts` validates `JSON.parse` results before casting them to `GameResult`).
- **Discriminated Unions:** `GameState` is a union of `SettingsState`, `PlayingState`, and `WonState`. This makes impossible states unrepresentable (e.g., you cannot access `secret` while the game is in the `Settings` phase).

### 3.7. Formatting & Consistency

- **ESLint + Prettier:** All TypeScript and JavaScript code is automatically formatted and linted.
- **Stylelint with Property Ordering:** CSS Modules are checked by Stylelint. The `stylelint-config-clean-order` and `stylelint-order` plugins are configured to automatically sort CSS properties in a logical, predictable order.
- **Husky `pre-commit` Hook:** Before every commit, `lint-staged` runs ESLint, Stylelint (with `--fix`), and Prettier only on the _staged_ files. This prevents badly formatted code from entering the repository and eliminates "style-only" comments during code review.
- **EditorConfig (`.editorconfig`):** A `.editorconfig` file is defined to enforce consistent coding styles across different IDEs and editors (VS Code, WebStorm, etc.).
- **Git Line Endings (`.gitattributes`):** A `.gitattributes` file (`* text=auto eol=lf`) is used to normalize line endings to LF across different operating systems.
