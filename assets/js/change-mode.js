const btnModes = document.querySelectorAll('.masthead__btn-mode');
const html = document.querySelector('html');
var nav = document.querySelector('#site-nav');
var btn = document.querySelector('#site-nav .navicon');
var vlinks = document.querySelector('#site-nav .visible-links');
var hlinks = document.querySelector('#site-nav .hidden-links');

function setMode(mode) {
  html.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('mode', mode);
  btnModes.forEach((btnMode) => {
    btnMode.classList.toggle('dark', mode === 'dark');
  });
}

const MODE = localStorage.getItem('mode') || 'dark';

setMode(MODE);

btnModes.forEach((btnMode) => {
  btnMode.addEventListener('click', () => {
    const newMode = html.classList.contains('dark') ? 'light' : 'dark';
    setMode(newMode);
  });
});

btn.addEventListener('click', () => {
  hlinks.classList.toggle('hidden');
  btn.classList.toggle('close');
});
