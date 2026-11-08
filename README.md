# 🐂 Bulls and Cows 🐄

The computer generates a secret number with unique digits. Your goal is to guess it. After each guess, you receive feedback: how many digits are correct and in the right place (**bulls**), and how many are correct but in the wrong place (**cows**).

## ✨ Key Features

#### The core focus of this project is a strictly functional, test-driven architecture. The game logic is completely isolated from the DOM and built using pure functions, higher-order functions, and immutable state.

- **Strict TDD:** Tests were written before the implementation and follow the **FIRST** principles (Fast, Independent, Repeatable, Self-validating, Timely).
- **Pure Functions & Immutability:** All game logic is built with pure functions without side effects. The game state and guess history are updated by creating new data structures (no `push` or mutations).
- **HOF & Currying:** Leverages higher-order functions (`map`, `filter`, `reduce`) and curried factories (e.g., `createDigitValidator`).
- **Dependency Injection:** Functions like `generateSecret` accept a `random` source as a parameter, making them deterministic and easily testable.
- **Recursion & Memoization:** Secret generation and possible combinations counting are implemented recursively with caching.
- **Responsive UI:** A minimalist interface generated entirely via the DOM API (no `innerHTML`).

## 🛠️ Tech Stack

- **TypeScript** — strict typing for all logic and UI.
- **Vitest** — test runner for verifying the game core.
- **CSS Modules** — isolated styles for components.
- **Husky + lint-staged** — code quality control before commits.
- **ESLint + Prettier + Stylelint** — consistent code style.

## 🚀 CI/CD & Deployment

The project is automatically deployed to **GitHub Pages** using GitHub Actions.

- **Automatic Deployment:** Every push to the `bulls-and-cows` branch triggers the workflow to build the project and deploy the `dist` folder to the `gh-pages` branch.
- **Manual Deployment:** You can also trigger the deployment manually from the **Actions** tab in the GitHub repository (using the `workflow_dispatch` event).

The live version is available at: **[Play the game](https://abeilleee.github.io/bulls-and-cows/)**

## 🛡️ Code Quality & Git Hooks

The project uses **Husky** and **lint-staged** to enforce code quality locally before any code is pushed to the remote repository.

- **`pre-commit` hook:** Runs `lint-staged` (ESLint, Prettier, Stylelint) on staged files to ensure code style consistency.
- **`pre-push` hook:** Runs the full test suite via `npm test` to block pushing code with failing tests.

## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/abeilleee/bulls-and-cows.git
   cd bulls-and-cows
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local development server (with Hot Module Replacement):

   ```bash
   npm run dev
   ```

## 🧪 Testing

- Run all tests:

  ```bash
  npm run test
  ```

- Run tests with UI dashboard and coverage report:

  ```bash
  npm run test:ui
  ```

## 🏗️ Project Architecture

```bash
src/
├── core/           # Pure game logic (independent of the DOM)
│   ├── countPossibleSecrets.test.ts
│   ├── countPossibleSecrets.ts
│   ├── createDigitValidator.test.ts
│   ├── createDigitValidator.ts
│   ├── evaluateGuess.test.ts
│   ├── evaluateGuess.ts
│   ├── generateSecret.test.ts
│   ├── generateSecret.ts
│   ├── isValidGuess.test.ts
│   └── isValidGuess.ts
├── storage/        # Storage layer (localStorage for the leaderboard)
├── store/          # Store (game state management, subscriptions)
├── ui/             # Components and screens (DOM)
│   ├── components/
│   └── screens/
├── utils/          # Helper functions
├── constants.ts    # Global constants
├── types.ts        # Shared types
└── main.ts         # Entry point (startApp)
```

## 📜 Scripts

- `npm run dev` — start the Vite development server.
- `npm run build` — compile TypeScript and build for production (Vite).
- `npm run preview` — locally preview the production build.
- `npm run lint` — run ESLint.
- `npm run format` — format code with Prettier.
- `npm test` — run tests with Vitest (watch mode).
- `npm run test:ui` — run tests with UI dashboard and coverage.
- `npm run deploy` — manually deploy the `dist` folder to GitHub Pages.
