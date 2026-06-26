document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('main-menu');
  const scrollBtn = document.getElementById('scrollTopBtn');
  const metrikaId = 110111330;

  const sendGoal = (goal) => {
    if (typeof window.ym === 'function') {
      window.ym(metrikaId, 'reachGoal', goal);
    }
  };

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

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const customGoal = link.dataset.goal;
    const text = link.textContent.toLowerCase();
    let decodedHref = href;

    try {
      decodedHref = decodeURIComponent(href).toLowerCase();
    } catch {
      decodedHref = href.toLowerCase();
    }

    if (link.closest('#task-catalog')) {
      sendGoal('catalog_click');
    }

    if (customGoal) {
      sendGoal(customGoal);
      return;
    }

    if (href.startsWith('tel:')) {
      sendGoal('phone_click');
      return;
    }

    if (href.startsWith('mailto:')) {
      sendGoal('email_click');

      if (decodedHref.includes('сняти') || text.includes('сняти')) {
        sendGoal('skinning_request_click');
      }

      if (decodedHref.includes('полотн') || text.includes('полотн')) {
        sendGoal('blade_request_click');
      }
    }
  });

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
