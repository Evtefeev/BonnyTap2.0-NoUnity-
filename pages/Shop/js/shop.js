import { data } from './data.js';

document.addEventListener('click', (event) => {
  const buttonType = event.target.dataset.type;

  if (!buttonType != '' && data) {
    return;
  }

  const HTMLcontent = data[buttonType];
  document.querySelector('main').innerHTML = HTMLcontent;
});
