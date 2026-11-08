import { createHeader } from '@/ui/components/Header';
import { createFooter } from '@/ui/components/Footer';
import { createDomElement } from '@/utils/createDomElement';
import { createStartScreen } from '@/ui/screens/StartScreen';
import { createGameScreen } from '@/ui/screens/GameScreen';
import { loadResults } from '@/storage/storage';
import { store } from './store/store';
import { GamePhase } from './types';

export function startApp() {
  document.body.classList.add('layout');

  const header = createHeader();
  const footer = createFooter();
  const main = createDomElement({
    tag: 'main',
    classNames: ['main'],
  });

  document.body.append(header, main, footer);

  let dispose: (() => void) | undefined;

  const mount = (element: HTMLElement, cleanup?: () => void) => {
    dispose?.(); // cleanup the previous screen (e.g. clear its timer)
    dispose = cleanup; // remember the new screen's cleanup for the next swap
    main.replaceChildren(element);
  };

  const render = () => {
    const state = store.getState();

    switch (state.phase) {
      case GamePhase.Settings:
        mount(
          createStartScreen({
            initialSettings: state.settings,
            onStart: store.startGame,
            results: loadResults(),
          }),
        );

        break;

      case GamePhase.Playing:
      case GamePhase.Won: {
        const screen = createGameScreen({
          state,
          onSubmit: store.submitGuess,
          onNewGame: store.resetGame,
        });

        mount(screen.element, screen.destroy);

        break;
      }
    }
  };

  store.subscribe(render);
  render();
}
