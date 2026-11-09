import { createDomElement } from '@/utils/createDomElement';
import { createRadio } from '@/ui/components/Radio';
import styles from './RadioGroup.module.css';

export interface RadioOption<T extends string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string | number> {
  name: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  disabled?: boolean;
  classNames?: string[];
  parentElement?: HTMLElement;
}

export function createRadioGroup<T extends string | number>({
  name,
  options,
  value,
  onChange,
  label,
  disabled = false,
  classNames = [],
  parentElement,
}: RadioGroupProps<T>): HTMLFieldSetElement {
  const group = createDomElement<HTMLFieldSetElement>({
    tag: 'fieldset',
    classNames: [...classNames, styles.group],
    parentElement,
  });

  if (label) {
    group.append(
      createDomElement({ tag: 'legend', classNames: [styles.legend], textContent: label }),
    );
  }

  const optionsContainer = createDomElement({
    tag: 'div',
    classNames: [styles.options],
    parentElement: group,
  });

  options.forEach((option) => {
    optionsContainer.append(
      createRadio({
        name,
        value: String(option.value),
        label: option.label,
        checked: String(option.value) === String(value),
        disabled: disabled || Boolean(option.disabled),
        onChange: () => onChange(option.value),
      }),
    );
  });

  return group;
}
