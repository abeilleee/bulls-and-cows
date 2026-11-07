import type { ElementOptions } from '@/ui/types';

export function createDomElement<T extends HTMLElement = HTMLElement>({
  tag = 'div',
  classNames,
  textContent,
  parentElement,
  children,
  attributes,
}: ElementOptions): T {
  const element = document.createElement(tag) as T;

  if (classNames && classNames.length > 0) {
    classNames.forEach((className) => element.classList.add(className));
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  if (parentElement) {
    parentElement.append(element);
  }

  if (children && children.length > 0) {
    children.forEach((child) => element.append(child));
  }

  if (attributes) {
    Object.entries(attributes).forEach(([attr, value]) => element.setAttribute(attr, value));
  }

  return element;
}
