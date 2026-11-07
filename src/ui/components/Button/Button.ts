import { createDomElement } from '@/utils/createDomElement';
import type { ElementOptions } from '@/ui/types';
import styles from './Button.module.css';

interface Props extends Omit<ElementOptions, 'tag'> {
  onClick: () => void;
}

export function createButton(props: Props) {
  const { onClick, classNames, textContent, children, parentElement } = props;

  const button = createDomElement({
    tag: 'button',
    classNames: [...(classNames ?? []), styles.button],
    textContent,
    parentElement,
    children,
    attributes: { type: 'button' },
  });

  button.addEventListener('click', onClick);

  return button;
}
