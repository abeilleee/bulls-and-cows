import { createDomElement } from '@/utils/createDomElement';
import type { ElementOptions } from '@/ui/types';
import styles from './Badge.module.css';

interface Props extends Pick<ElementOptions, 'parentElement'> {
  text: string;
  variant?: 'success' | 'warning';
  parentElement?: HTMLElement;
}

export function createBadge({ text, variant = 'success', parentElement }: Props) {
  return createDomElement({
    tag: 'span',
    classNames: [styles.badge, styles[variant]],
    textContent: text,
    parentElement,
  });
}
