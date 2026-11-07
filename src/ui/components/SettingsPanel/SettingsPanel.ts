import { createRadioGroup, type RadioOption } from '@/ui/components/RadioGroup';
import { createButton } from '@/ui/components/Button';
import { createDomElement } from '@/utils/createDomElement';
import { AVAILABLE_LENGTHS } from '@/constants';
import { Base } from '@/core/types';
import { countPossibleSecrets } from '@/core/countPossibleSecrets';
import type { AvailableLength, GameSettings } from '@/types';
import styles from './SettingsPanel.module.css';

const BASE_OPTIONS: RadioOption<Base>[] = [
  { value: Base.bin, label: 'BIN' },
  { value: Base.oct, label: 'OCT' },
  { value: Base.dec, label: 'DEC' },
  { value: Base.hex, label: 'HEX' },
];

interface Props {
  initialSettings: GameSettings;
  onStart: (settings: GameSettings) => void;
}

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
