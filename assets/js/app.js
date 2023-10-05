initMobileNav();

function initMobileNav() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.mobile-nav');
  
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  })

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
    }
  });
}

document.addEventListener('input', (e) => {
  const target = e.target;
  if (target.getAttribute('type') === 'file') {
    const text = target.closest('.btn-file').querySelector('.btn-file__text');
    if (target.files.length === 0) {
      text.textContent = 'Выберите файлы';
    } else {
      const files = Array.from(target.files);
      const fileNames = files.map((file) => file.name).join(', ');
      text.textContent = fileNames;
    }
  }
});