import { createDomElement } from '@/utils/createDomElement';
import type { ElementOptions } from '@/ui/types';
import styles from './Header.module.css';

type Props = Omit<ElementOptions, 'tag'>;

export function createHeader(props?: Props) {
  return createDomElement({
    tag: 'header',
    classNames: [...(props?.classNames ?? []), styles.header],
    parentElement: props?.parentElement,
    children: [createDomElement({ tag: 'h1', textContent: 'Bulls and Cows' })],
  });
}
