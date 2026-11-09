import { createButton } from '@/ui/components/Button';
import { createDomElement } from '@/utils/createDomElement';
import { createDigitValidator } from '@/core/createDigitValidator';
import { getDigits } from '@/utils/getDigits';
import type { Base } from '@/core/types';
import styles from './GameInput.module.css';

interface Props {
  length: number;
  base: Base;
  onSubmit: (guess: string) => string | null;
}

export function createGameInput({ length, base, onSubmit }: Props) {
  const container = createDomElement({
    classNames: [styles.container],
  });

  const row = createDomElement({
    classNames: [styles.row],
    parentElement: container,
  });

  const input = createDomElement<HTMLInputElement>({
    tag: 'input',
    classNames: [styles.input],
    parentElement: row,
    attributes: {
      type: 'text',
      maxlength: String(length),
      placeholder: `Enter ${length} unique digits`,
      autocomplete: 'off',
      autocapitalize: 'off',
      'aria-label': `Enter ${length} unique digits in base ${base}`,
    },
  });

  const isDigit = createDigitValidator(base);
  const digits = getDigits(base);

  const error = createDomElement({
    tag: 'p',
    classNames: [styles.error],
    parentElement: container,
    attributes: { role: 'alert', 'aria-live': 'polite' },
  });

  const showError = (message: string) => {
    error.textContent = message;
    input.classList.add(styles.invalid);
    input.setAttribute('aria-invalid', 'true');
  };

  const clearError = () => {
    if (!error.textContent) {
      return;
    }

    error.textContent = '';
    input.classList.remove(styles.invalid);
    input.setAttribute('aria-invalid', 'false');
  };

  const handleSubmit = () => {
    const guess = input.value.trim();
    const message = onSubmit(guess);

    if (message !== null) {
      showError(message);
      input.focus();

      return;
    }

    clearError();
    input.value = '';
  };

  input.addEventListener('beforeinput', (event) => {
    if (!event.inputType.startsWith('insert')) {
      return;
    }

    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const selectedLength = end - start;
    const insertedText = event.data ?? event.dataTransfer?.getData('text') ?? '';
    const invalidChar = [...insertedText].find((char) => !isDigit(char));
    const nextLength = input.value.length - selectedLength + insertedText.length;

    if (invalidChar !== undefined) {
      event.preventDefault();
      showError(`"${invalidChar.toUpperCase()}" is not allowed. Use digits: ${digits}`);

      return;
    }

    if (nextLength > length) {
      event.preventDefault();
      showError(`Maximum length is ${length} digits`);

      return;
    }

    clearError();
  });

  input.addEventListener('input', () => {
    const filtered = [...input.value].filter(isDigit).join('').slice(0, length);

    if (filtered === input.value) {
      clearError();

      return;
    }

    input.value = filtered;
    showError(`Only digits ${digits} are allowed`);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  });

  createButton({
    textContent: 'Check',
    onClick: handleSubmit,
    parentElement: row,
  });

  requestAnimationFrame(() => input.focus());

  return container;
}
