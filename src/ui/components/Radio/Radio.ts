import { createDomElement } from '@/utils/createDomElement';
import styles from './Radio.module.css';

export interface RadioProps {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function createRadio({
  name,
  value,
  label,
  checked = false,
  disabled = false,
  onChange,
}: RadioProps) {
  const input = createDomElement<HTMLInputElement>({
    tag: 'input',
    classNames: [styles.input],
    attributes: { type: 'radio', name, value },
  });

  input.checked = checked;
  input.disabled = disabled;

  if (onChange) {
    input.addEventListener('change', () => onChange(value));
  }

  return createDomElement<HTMLLabelElement>({
    tag: 'label',
    classNames: disabled ? [styles.radio, styles.disabled] : [styles.radio],
    children: [
      input,
      createDomElement({ tag: 'span', classNames: [styles.label], textContent: label }),
    ],
  });
}
