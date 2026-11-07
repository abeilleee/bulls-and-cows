export interface ElementOptions {
  tag?: string;
  classNames?: string[];
  textContent?: string;
  parentElement?: HTMLElement;
  children?: HTMLElement[];
  attributes?: Record<string, string>;
}
