/**
 * main.js — global orchestration:
 *   nav scroll state + mobile menu, scroll-spy, section reveal FX (Anime.js v3),
 *   hero char-reveal, lightbox, CV download, background grid, page-load sequence.
 *
 * All motion honors prefers-reduced-motion.
 */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasAnime = typeof window.anime !== 'undefined';

  // ================= nav =================
  const nav = document.getElementById('siteNav');
  const onScrollNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // mobile menu
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = open;
    if (!open) {
      mobileMenu.querySelectorAll('a').forEach((a, i) => {
        if (hasAnime && !reducedMotion) {
          anime({
            targets: a, opacity: [0, 1], translateY: [-8, 0],
            duration: 320, delay: i * 40, easing: 'easeOutExpo',
          });
        }
      });
    }
  });
  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    })
  );

  // ================= scroll-spy =================
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => spy.observe(s));

  // ================= section reveal FX =================
  const fxTargets = new Map(); // element -> type
  document.querySelectorAll('[data-fx]').forEach((el) => {
    fxTargets.set(el, el.dataset.fx);
  });

  function playFx(target) {
    const type = fxTargets.get(target);
    if (reducedMotion || !hasAnime) {
      // ensure visible even when animation is disabled
      target.style.opacity = '';
      target.style.transform = '';
      return;
    }
    switch (type) {
      case 'reveal-up':
        anime({
          targets: target,
          opacity: [0, 1], translateY: [34, 0],
          duration: 900, easing: 'easeOutExpo',
        });
        break;
      case 'reveal-left':
        anime({
          targets: target,
          opacity: [0, 1], translateX: [-40, 0],
          duration: 900, easing: 'easeOutExpo',
        });
        break;
      case 'card-tilt-in':
        anime({
          targets: target,
          opacity: [0, 1], rotateX: [9, 0], translateZ: [-60, 0],
          duration: 1000, easing: 'easeOutExpo',
        });
        break;
      case 'char-reveal':
        charReveal(target);
        break;
      default:
        target.style.opacity = '1';
    }
  }

  function charReveal(el) {
    const text = el.textContent;
    el.textContent = '';
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(span);
    });
    anime({
      targets: el.children,
      opacity: [0, 1],
      translateY: [26, 0],
      duration: 900,
      delay: anime.stagger(26, { start: 250 }),
      easing: 'easeOutExpo',
    });
  }

  if (reducedMotion || !hasAnime) {
    // static: everything visible immediately
    fxTargets.forEach((_, el) => { el.style.opacity = '1'; });
  } else {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (e.target.closest('.hero-copy') || e.target.closest('.stage-caption') || e.target.classList.contains('scroll-cue')) {
            obs.unobserve(e.target);
            return;
          }
          playFx(e.target);
          obs.unobserve(e.target);
        });
      },
      { threshold: 0.05, rootMargin: '100px' }
    );
    fxTargets.forEach((type, el) => {
      if (type === 'char-reveal') return;
      revealObs.observe(el);
    });
  }

  // hero char-reveal is part of load sequence
  const heroLine = document.querySelector('#hero .hero-line');
  if (heroLine && !reducedMotion && hasAnime) {
    heroLine.style.opacity = '1'; // container is visible; spans start at 0
    charReveal(heroLine);
  }

  // ================= page-load sequence =================
  if (!reducedMotion && hasAnime) {
    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: nav,
        opacity: [0, 1], translateY: [-16, 0],
        duration: 700,
      })
      .add({
        targets: '.hero-eyebrow',
        opacity: [0, 1], translateY: [20, 0],
        duration: 700,
      }, '-=400')
      .add({
        targets: '.hero-role, .hero-sub',
        opacity: [0, 1], translateY: [26, 0],
        duration: 800,
        delay: anime.stagger(120),
      }, '-=300')
      .add({
        targets: '.hero-cta .btn',
        opacity: [0, 1], translateY: [20, 0],
        duration: 700,
        delay: anime.stagger(90),
      }, '-=400')
      .add({
        targets: '.scroll-cue',
        opacity: [0, 1],
        duration: 800,
      }, '-=200');
  }

  // ================= lightbox =================
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const certCard = document.getElementById('certCard');
  let lastFocus = null;

  function openLightbox() {
    lastFocus = document.activeElement;
    lbImg.src = 'Certification_page.jpg';
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    setTimeout(() => { lightbox.hidden = true; }, 260);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  certCard.addEventListener('click', openLightbox);
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    if (e.key === 'Tab' && !lightbox.hidden) {
      // keep focus trapped inside lightbox
      const focusables = [lbClose];
      const idx = focusables.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); focusables[focusables.length - 1].focus(); }
      if (!e.shiftKey && idx === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
    }
  });

  // ================= CV download =================
  const cvBtn = document.getElementById('cvBtn');
  cvBtn.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = 'Hazem_Hadj_Ahmed.pdf';
    a.download = 'Hazem_Hadj_Ahmed.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // ================= smooth anchor scroll =================
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    });
  });

  // ================= background engineering grid =================
  const canvas = document.getElementById('grid-bg');
  function initGrid() {
    if (reducedMotion) {
      // still draw a static faint grid
      drawGrid(0, 0);
      return;
    }
    let px = 0, py = 0, cx = 0, cy = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = () => canvas.clientWidth, h = () => canvas.clientHeight;
    canvas.width = w() * dpr;
    canvas.height = h() * dpr;
    canvas.getContext('2d').scale(dpr, dpr);

    window.addEventListener('resize', () => {
      canvas.width = w() * dpr;
      canvas.height = h() * dpr;
      canvas.getContext('2d').scale(dpr, dpr);
      drawGrid(cx, cy);
    });
    window.addEventListener('scroll', () => {
      // subtle parallax driven by scroll
      py = window.scrollY * 0.05;
    }, { passive: true });
    window.addEventListener('pointermove', (e) => {
      px = e.clientX - w() / 2;
    });

    let t = 0;
    function tick() {
      if (running) {
        t += 0.012;
        cx += (px * 0.02 - cx) * 0.04;
        cy += (py - cy) * 0.04;
        drawGrid(cx + Math.sin(t) * 6, cy + Math.cos(t * 0.8) * 6, t);
        requestAnimationFrame(tick);
      }
    }
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(tick);
    });
    requestAnimationFrame(tick);
  }

  function drawGrid(ox, oy, t) {
    const ctx = canvas.getContext('2d');
    const W = canvas.clientWidth, H = canvas.clientHeight;
    ctx.clearRect(0, 0, W, H);
    const gap = 56;
    // offset drift
    const startX = -(((ox * 0.3) % gap) + gap) ;
    const startY = -(((oy * 0.3) % gap) + gap);
    ctx.lineWidth = 1;

    // vertical + horizontal grid
    for (let x = startX; x < W + gap; x += gap) {
      const prox = Math.abs(x - W / 2) / (W / 2);
      ctx.strokeStyle = `rgba(62,230,200,${(0.05 * (1 - prox * 0.5)).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = startY; y < H + gap; y += gap) {
      const prox = Math.abs(y - H / 2) / (H / 2);
      ctx.strokeStyle = `rgba(236,239,244,${(0.03 * (1 - prox * 0.5)).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // a few floating "node" dots at intersections, low opacity, for depth
    const dots = 14;
    for (let i = 0; i < dots; i++) {
      const seed = i * 0.618;
      const dx = (Math.sin(seed * 3 + t * 0.4) * 0.5 + 0.5) * W;
      const dy = (Math.cos(seed * 2.2 + t * 0.3) * 0.5 + 0.5) * H;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(62,230,200,0.18)';
      ctx.fill();
    }
  }
  if (canvas) initGrid();
})();
