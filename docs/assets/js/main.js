document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('main-menu');
  const scrollBtn = document.getElementById('scrollTopBtn');

  const closeMenu = () => {
    if (!nav || !burger) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };

  if (nav && burger) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (menu) {
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  if (scrollBtn) {
    const syncScrollButton = () => {
      scrollBtn.classList.toggle('show', window.scrollY > 320);
    };

    window.addEventListener('scroll', syncScrollButton, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    syncScrollButton();
  }
});
