import { createHeader } from '@/ui/components/Header';
import { createFooter } from '@/ui/components/Footer';
import { createDomElement } from '@/utils/createDomElement';

export function startApp() {
  document.body.classList.add('layout');
  createHeader({ parentElement: document.body });
  createDomElement({
    tag: 'main',
    classNames: ['main'],
    parentElement: document.body,
  });
  createFooter({ parentElement: document.body });
}
