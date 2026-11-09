import { createDomElement } from '@/utils/createDomElement';
import type { ElementOptions } from '@/ui/types';
import styles from './Footer.module.css';

type Props = Omit<ElementOptions, 'tag' | 'textContent'>;

export function createFooter(props?: Props) {
  return createDomElement({
    tag: 'footer',
    classNames: [...(props?.classNames ?? []), styles.footer],
    parentElement: props?.parentElement,
    children: [
      createDomElement({
        tag: 'a',
        attributes: { href: 'https://github.com/abeilleee', target: '_blank' },
        children: [
          createDomElement({
            tag: 'img',
            classNames: [styles.logo],
            attributes: { src: 'gh.svg', alt: 'github link' },
          }),
        ],
      }),
      createDomElement({ tag: 'p', textContent: '2026' }),
      createDomElement({
        tag: 'a',
        attributes: { href: 'https://rs.school/courses/javascript', target: '_blank' },
        children: [
          createDomElement({
            tag: 'img',
            classNames: [styles.logo],
            attributes: { src: 'rs.svg', alt: 'github link' },
          }),
        ],
      }),
    ],
  });
}
