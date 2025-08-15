// Бургер-меню + карусель + кнопка «Наверх»
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('main-menu');

  if (burger && nav && menu) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Универсальный слайдер для всех .carousel
  document.querySelectorAll('.carousel').forEach(carousel => {
    const slidesEl = carousel.querySelector('.slides');
    const slides = Array.from(slidesEl.children);
    let current = 0;
    const total = slides.length;
    let interval;

    function goTo(idx) {
      current = (idx + total) % total;
      slidesEl.style.transform = `translateX(-${current * 100}%)`;
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() { interval = setInterval(next, 5000); }
    function stopAuto() { clearInterval(interval); }

    const nextBtn = carousel.querySelector('.carousel-control.next');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
      prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    }

    goTo(0);
    startAuto();
  });

  // Кнопка «Наверх»
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    const onScroll = () => {
      if (window.scrollY > 150) scrollBtn.classList.add('show');
      else scrollBtn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ===== Contacts dropdown toggle for touch =====
  const hc = document.querySelector('.header-contacts');
  if (hc) {
    const label = hc.querySelector('.hc-label');
    if (label) {
      label.setAttribute('role', 'button');
      label.setAttribute('tabindex', '0');
      const toggle = (e) => {
        e.preventDefault();
        hc.classList.toggle('open');
      };
      label.addEventListener('click', toggle);
      label.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') toggle(e); });
      document.addEventListener('click', (e)=>{ if(!hc.contains(e.target)) hc.classList.remove('open'); });
    }
  }

  // ===== Close mobile menu after clicking a link
  if (menu) {
    menu.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== IMG fallback: if .jpg missing, try .png from data-fallback
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (!img.dataset.triedFallback) {
        img.dataset.triedFallback = '1';
        img.src = img.dataset.fallback;
      }
    }, { once: true });
  });

  // ===== Simple swipe for carousels
  document.querySelectorAll('.carousel').forEach(carousel => {
    let startX = 0, dx = 0, dragging = false;
    // ===== Simple swipe for carousels
  document.querySelectorAll('.carousel').forEach(carousel => {
    let startX = 0, dx = 0, dragging = false;
    const onStart = (x) => { startX = x; dragging = true; };
    const onMove = (x) => { if (!dragging) return; dx = x - startX; };
    const onEnd = () => {
      if (!dragging) return;
      if (Math.abs(dx) > 40) {
        const btn = carousel.querySelector(dx < 0 ? '.carousel-control.next' : '.carousel-control.prev');
        if (btn) btn.click();
      }
      startX = 0; dx = 0; dragging = false;
    };
    carousel.addEventListener('touchstart', (e)=>onStart(e.touches[0].clientX), {passive:true});
    carousel.addEventListener('touchmove', (e)=>onMove(e.touches[0].clientX), {passive:true});
    carousel.addEventListener('touchend', onEnd, {passive:true});
  });
  });
});


// === Theme toggle ===

  // === THEME_TOGGLE (text + switch) ===
  const THEME_KEY = 'theme';
  const themeCheckbox = document.getElementById('themeToggle');
  const themeText = document.querySelector('.theme-switch .theme-text');
  const applyTheme2 = (t) => {
    const root = document.documentElement;
    if (t === 'dark') root.classList.add('theme-dark'); else root.classList.remove('theme-dark');
    if (themeCheckbox) themeCheckbox.checked = (t === 'dark');
    if (themeText) themeText.textContent = 'Тема: ' + (t === 'dark' ? 'тёмная' : 'светлая');
  };
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme2(savedTheme);
  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', () => {
      const next = themeCheckbox.checked ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme2(next);
    });
  }

  // Swipe for carousels (touch)
  document.querySelectorAll('.carousel').forEach(carousel => {
    const slidesEl = carousel.querySelector('.slides');
    if (!slidesEl) return;
    let sx=0, dx=0, touching=false;
    const nextBtn = carousel.querySelector('.carousel-control.next');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    slidesEl.addEventListener('touchstart', (e)=>{ touching=true; sx=e.touches[0].clientX; dx=0; }, {passive:true});
    slidesEl.addEventListener('touchmove', (e)=>{ if(!touching) return; dx=e.touches[0].clientX - sx; }, {passive:true});
    slidesEl.addEventListener('touchend', ()=>{ if(!touching) return; touching=false; if(Math.abs(dx)>40){ if(dx<0 && nextBtn) nextBtn.click(); if(dx>0 && prevBtn) prevBtn.click(); } }, {passive:true});
  });

});