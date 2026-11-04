import './style.css';

document
  .querySelector<HTMLDivElement>('#app')
  ?.append((document.createElement('p').textContent = 'start app'));
