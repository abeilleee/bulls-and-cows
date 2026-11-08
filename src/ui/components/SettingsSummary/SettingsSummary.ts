import { createDomElement } from '@/utils/createDomElement';
import { formatBase } from '@/utils/formatBase';
import { getDigits } from '@/utils/getDigits';
import type { ElementOptions } from '@/ui/types';
import type { GameSettings } from '@/types';
import styles from './SettingsSummary.module.css';

interface Props extends Pick<ElementOptions, 'parentElement'> {
  settings: GameSettings;
}

export function createSettingsSummary({ settings, parentElement }: Props) {
  const container = createDomElement({
    classNames: [styles.summary],
    parentElement,
  });

  createDomElement({
    tag: 'p',
    classNames: [styles.options],
    textContent: `Length: ${settings.length} Base: ${formatBase(settings.base)}`,
    parentElement: container,
  });

  createDomElement({
    tag: 'p',
    classNames: [styles.digits],
    textContent: `Digits: ${getDigits(settings.base)}`,
    parentElement: container,
  });

  return container;
}
