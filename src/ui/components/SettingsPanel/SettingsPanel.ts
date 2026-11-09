import { createRadioGroup, type RadioOption } from '@/ui/components/RadioGroup';
import { createButton } from '@/ui/components/Button';
import { createDomElement } from '@/utils/createDomElement';
import { AVAILABLE_LENGTHS, BASE_LABEL_ENTRIES } from '@/constants';
import { countPossibleSecrets } from '@/core/countPossibleSecrets';
import type { AvailableLength, GameSettings } from '@/types';
import type { Base } from '@/core/types';
import styles from './SettingsPanel.module.css';

interface Props {
  initialSettings: GameSettings;
  onStart: (settings: GameSettings) => void;
}

export const BASE_OPTIONS: RadioOption<Base>[] = BASE_LABEL_ENTRIES.map(([value, label]) => ({
  value,
  label,
}));

export function createSettingsPanel({ initialSettings, onStart }: Props) {
  const container = createDomElement({
    classNames: [styles.container],
  });

  const radioGroupWrapper = createDomElement({
    classNames: [styles.wrapper],
    parentElement: container,
  });

  const possibleSecrets = createDomElement({
    tag: 'p',
    parentElement: container,
  });

  let currentGameSettings = initialSettings;

  const renderSettings = () => {
    const { base, length } = currentGameSettings;

    possibleSecrets.textContent = `Possible secrets for these settings: ${countPossibleSecrets(length, base)}`;

    const lengthOptions: RadioOption<AvailableLength>[] = AVAILABLE_LENGTHS.map((value) => ({
      value,
      label: String(value),
      disabled: value > base,
    }));

    radioGroupWrapper.replaceChildren(
      createRadioGroup({
        name: 'base',
        label: 'Number base',
        options: BASE_OPTIONS,
        value: base,
        onChange: (value) => {
          currentGameSettings = {
            ...currentGameSettings,
            base: value,
            length: Math.min(currentGameSettings.length, value) as AvailableLength,
          };
          renderSettings();
        },
      }),

      createRadioGroup({
        name: 'length',
        label: 'Secret number length',
        options: lengthOptions,
        value: length,
        onChange: (value: AvailableLength) => {
          currentGameSettings = {
            ...currentGameSettings,
            length: value,
          };
          renderSettings();
        },
      }),
    );
  };

  createButton({
    onClick: () => onStart(currentGameSettings),
    textContent: 'Start Game',
    parentElement: container,
  });

  renderSettings();

  return container;
}
