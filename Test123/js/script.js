// Core interactions: burger, carousel, theme, scroll-to-top, image fallback, swipe
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('main-menu');

  // Burger toggle
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close mobile menu after clicking a link
  if (menu && nav && burger) {
    menu.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Universal carousel (.carousel > .slides > img) =====
  document.querySelectorAll('.carousel').forEach(carousel => {
    const slidesEl = carousel.querySelector('.slides');
    if (!slidesEl) return;
    const slides = Array.from(slidesEl.children);
    if (!slides.length) return;

    // Ensure widths for horizontal translate
    slidesEl.style.display = 'flex';
    slidesEl.style.transition = 'transform 400ms ease';
    slides.forEach(s => { s.style.flex = '0 0 100%'; });

    let current = 0;
    const total = slides.length;
    let timerId = null;

    const goTo = (idx) => {
      current = (idx + total) % total;
      slidesEl.style.transform = `translateX(-${current * 100}%)`;
    };
    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAuto = () => {
      stopAuto();
      timerId = window.setInterval(next, 5000);
    };
    const stopAuto = () => {
      if (timerId) { clearInterval(timerId); timerId = null; }
    };

    // Controls
    const nextBtn = carousel.querySelector('.carousel-control.next');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

    // Swipe
    let startX = 0, dx = 0, touching = false;
    const onStart = (x) => { touching = true; startX = x; dx = 0; stopAuto(); };
    const onMove  = (x) => { if (!touching) return; dx = x - startX; };
    const onEnd   = () => {
      if (!touching) return;
      touching = false;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
      }
      startAuto();
    };
    slidesEl.addEventListener('touchstart', (e)=> onStart(e.touches[0].clientX), {passive:true});
    slidesEl.addEventListener('touchmove',  (e)=> onMove(e.touches[0].clientX),  {passive:true});
    slidesEl.addEventListener('touchend',   onEnd, {passive:true});

    // Init
    goTo(0);
    startAuto();
  });

  // ===== Scroll to top button =====
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    const onScroll = () => {
      if (window.scrollY > 150) scrollBtn.classList.add('show'); else scrollBtn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  }

  // ===== Image fallback: use data-fallback if src fails =====
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback && img.src !== img.dataset.fallback) {
        img.src = img.dataset.fallback;
      }
    }, { once: true });
  });

  // ===== Theme toggle =====
  const THEME_KEY = 'theme';
  const themeCheckbox = document.getElementById('themeToggle');
  const themeText = document.querySelector('.theme-switch .theme-text');
  const applyTheme = (t) => {
    document.documentElement.classList.toggle('theme-dark', t === 'dark');
    if (themeCheckbox) themeCheckbox.checked = (t === 'dark');
    if (themeText) themeText.textContent = 'Тема: ' + (t === 'dark' ? 'тёмная' : 'светлая');
  };
  let saved = localStorage.getItem(THEME_KEY);
  if (!saved) { saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  applyTheme(saved);
  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
      const next = themeCheckbox.checked ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
});
