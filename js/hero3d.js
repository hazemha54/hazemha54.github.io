/**
 * hero3d.js — 3D "system diagram" hero stage.
 *
 * Anime.js v3 drives:
 *   - the load-in assembly (nodes scale/fade in with stagger, links fade in)
 *   - the ambient floating of module nodes + hub ring spin
 *   - the traveling data dots (SVG animateMotion, one dot per link)
 * CSS 3D perspective + pointer parallax (lerped rAF) drives:
 *   - the tilt of the whole stage + per-node depth offset
 *
 * All motion honors prefers-reduced-motion.
 */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  const svg = document.getElementById('systemDiagram');
  const tilt = document.getElementById('stageTilt');
  const frame = tilt ? tilt.firstElementChild : null; // .stage-frame
  if (!svg || !frame) return;

  // ---------- build the traveling data dots ----------
  const dotsLayer = document.getElementById('diagramDots');
  const innerLinks = document.querySelectorAll('#innerLinks path');
  const outerLinks = document.querySelectorAll('#outerLinks path');

  // Give each connection path a stable id so <animateMotion><mpath> can reference it.
  function idPaths(paths, prefix) {
    paths.forEach((p, i) => { p.id = prefix + '-' + i; });
  }
  idPaths(innerLinks, 'ilk');
  idPaths(outerLinks, 'olk');

  const NS = 'http://www.w3.org/2000/svg';

  function spawnDots(paths, cls) {
    const created = [];
    paths.forEach((p) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', '3.2');
      if (cls) c.setAttribute('class', cls);
      c.setAttribute('opacity', '0');

      const am = document.createElementNS(NS, 'animateMotion');
      am.setAttribute('dur', (2.6 + Math.random() * 1.8).toFixed(2) + 's');
      am.setAttribute('repeatCount', 'indefinite');
      am.setAttribute('rotate', 'auto');

      const mp = document.createElementNS(NS, 'mpath');
      mp.setAttribute('href', '#' + p.id);
      am.appendChild(mp);

      c.appendChild(am);
      dotsLayer.appendChild(c);
      created.push(c);
    });
    return created;
  }
  const tealDots = spawnDots(innerLinks, '');
  const orangeDots = spawnDots(outerLinks, 'dot-orange');

  // ---------- assembly on load ----------
  function runAssembly() {
    if (typeof anime === 'undefined') {
      revealStatic();
      return;
    }

    anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: '.d-center', scale: [0.6, 1], opacity: [0, 1], duration: 900, transformOrigin: 'center' })
      .add({ targets: '.d-module', scale: [0.4, 1], opacity: [0, 1], duration: 800, delay: anime.stagger(70), transformOrigin: 'center' }, '-=500')
      .add({ targets: '.d-system', scale: [0.5, 1], opacity: [0, 1], duration: 800, delay: anime.stagger(60), transformOrigin: 'center' }, '-=400')
      .add({ targets: '.d-hub', scale: [0.5, 1], opacity: [0, 1], duration: 800, easing: 'easeOutElastic(1, .7)', transformOrigin: 'center' }, '-=400')
      .add({
        targets: [innerLinks, outerLinks],
        opacity: [0, 0.85],
        duration: 600,
        delay: anime.stagger(80),
      }, '-=200');

    // start the dots
    const allDots = Array.from(dotsLayer.querySelectorAll('circle'));
    allDots.forEach((d, i) => {
      anime({
        targets: d,
        opacity: [0, 0.9],
        duration: 500,
        delay: 1400 + i * 90,
        easing: 'linear',
      });
    });

    // ambient loops
    if (!reducedMotion) {
      // gentle float on module nodes — each gets a slightly different offset
      document.querySelectorAll('.d-module').forEach((mod, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        anime({
          targets: mod,
          translateY: [0, dir * (3 + i)],
          translateX: [0, -dir * (2 + i * 0.5)],
          duration: 2400 + i * 200,
          direction: 'alternate',
          loop: true,
          easing: 'easeInOutSine',
          delay: i * 180,
        });
      });

      // slow spin on the hub ring — origin must be its own center (not SVG 0,0)
      anime({
        targets: '.d-hub .hub-ring',
        rotate: [0, 360],
        duration: 24000,
        loop: true,
        easing: 'linear',
        transformOrigin: '50% 50%',
        transformBox: 'fill-box',
      });

      // pulse the center ring
      anime({
        targets: '.d-center .center-ring',
        scale: [1, 1.04],
        opacity: [0.8, 1],
        duration: 2400,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        transformOrigin: 'center',
        transformBox: 'fill-box',
      });
    }
  }

  function revealStatic() {
    Array.from(dotsLayer.querySelectorAll('circle')).forEach((d) => d.setAttribute('opacity', '0.9'));
    const paths = Array.from(innerLinks).concat(Array.from(outerLinks));
    paths.forEach((p) => p.style.opacity = '0.85');
  }

  // ---------- pointer parallax on the whole stage ----------
  function initParallax() {
    if (reducedMotion || coarsePointer || !tilt) return;

    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let running = true;
    let rafId = null;

    const hero = document.getElementById('hero');

    function onMove(e) {
      const r = hero.getBoundingClientRect();
      targetX = (e.clientX - r.left) / r.width - 0.5;
      targetY = (e.clientY - r.top) / r.height - 0.5;
    }
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });

    // capture each node's original transform ONCE, so we don't keep appending
    const nodeBases = new Map();
    svg.querySelectorAll('.d-node').forEach((n) => {
      nodeBases.set(n, n.getAttribute('transform') || '');
    });

    function tick() {
      if (!running) return;
      const ease = 0.06;
      curX += (targetX - curX) * ease;
      curY += (targetY - curY) * ease;

      const rotY = curX * 14;
      const rotX = -curY * 12;
      svg.querySelectorAll('.d-node').forEach((n) => {
        const depth = parseFloat(n.dataset.depth || '1');
        const tx = (-curX * 22 * depth).toFixed(2);
        const ty = (-curY * 18 * depth).toFixed(2);
        const base = nodeBases.get(n);
        n.setAttribute('transform', base + ` translate(${tx} ${ty})`);
      });

      frame.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) rafId = requestAnimationFrame(tick);
      else if (rafId) cancelAnimationFrame(rafId);
    });

    rafId = requestAnimationFrame(tick);
  }

  // ---------- boot ----------
  function boot() {
    if (reducedMotion) {
      revealStatic();
      return;
    }
    runAssembly();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
